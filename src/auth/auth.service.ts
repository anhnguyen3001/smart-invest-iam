import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { hashData } from 'common/utils';
import { configService } from 'config/config.service';
import { OtpService } from 'otp/otp.service';
import { OtpTypeEnum } from 'storage/entities/otp.entity';
import { User } from 'storage/entities/user.entity';
import { MailService } from '../external/mail/mail.service';
import { MailTokenService } from '../mail-token/mail-token.service';
import { UserExistedException } from '../user/user.exception';
import { UserService } from '../user/user.service';
import {
  AccessDeniedException,
  EmailValidatedException,
  InvalidCredentialException,
  InvalidTokenException,
  UserNotFoundException,
} from './auth.exception';
import { JWT_SECRET_KEY } from './constants';
import {
  ForgetPasswordDto,
  LoginDto,
  MailEnum,
  ResendMailQueryDto,
  ResetPasswordDto,
  ResetPasswordQuery,
  SignupDto,
  Tokens,
  VerifyUserQueryDto,
} from './dtos';
import { IJWTPayload, ILoginSocialInfo } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly otpService: OtpService,
  ) {}

  async login(dto: LoginDto): Promise<Tokens> {
    dto.validate();

    const { email, password } = dto;

    const user = await this.userService.findOne({ email, isVerified: true });
    if (!user || !user.password) {
      throw new InvalidCredentialException();
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new InvalidCredentialException();
    }

    return this.getTokens(user);
  }

  async loginSocial(user: User): Promise<Tokens> {
    return this.getTokens(user);
  }

  async logout(id: number): Promise<void> {
    await this.userService.update(id, { refreshToken: null });
  }

  async signup(dto: SignupDto): Promise<User> {
    const { confirmPassword, ...restDto } = dto;
    const user = await this.userService.create(restDto);

    await this.sendVerifyUserMail(user);

    return user;
  }

  async verifyUser(query: VerifyUserQueryDto): Promise<void> {
    const { email, token } = query;

    await this.validateTokenMail(email, token);

    const user = await this.userService.findOneByLocalEmail(email);
    if (!user) {
      throw new UserNotFoundException();
    }

    if (user.isVerified) {
      throw new EmailValidatedException();
    }

    this.userService.update(user.id, { isVerified: true });
  }

  async forgetPassword(data: ForgetPasswordDto): Promise<User> {
    const { email } = data;

    const user = await this.userService.findOneByLocalEmail(email);
    if (!user) {
      throw new UserNotFoundException();
    }
    console.log('userId pass ', user.id);
    await this.sendForgetPasswordMail(user);
    return user;
  }

  async resetPassword(
    query: ResetPasswordQuery,
    data: ResetPasswordDto,
  ): Promise<void> {
    data.validate();

    const { email, token } = query;
    const { password } = data;

    await this.validateTokenMail(email, token);

    const user = await this.userService.findOneByLocalEmail(email);
    if (!user) {
      throw new UserNotFoundException();
    }

    const hashPassword = await hashData(password);
    await this.userService.update(user.id, { password: hashPassword });
  }

  async resendMail(data: ResendMailQueryDto): Promise<void> {
    const { type, email } = data;

    const user = await this.userService.findOneByLocalEmail(email);
    if (!user) {
      throw new UserNotFoundException();
    }

    if (type === MailEnum.register) {
      await this.sendVerifyUserMail(user);
    } else if (type === MailEnum.resetPassword) {
      await this.sendForgetPasswordMail(user);
    }
  }

  async sendVerifyUserMail(user: User): Promise<void> {
    const otp = await this.otpService.generate(user, OtpTypeEnum.verifyUser);
    // const token = await this.mailTokenService.generate(
    //   user,
    //   email,
    //   MailTokenTypeEnum.verifyUser,
    // );
    await this.mailService.sendVerifyUserMail(user.email, otp);
  }

  async sendForgetPasswordMail(user: User): Promise<void> {
    const otp = await this.otpService.generate(
      user,
      OtpTypeEnum.forgetPassword,
    );
    console.log('otp ', otp);
    // await this.mailService.sendForgetPasswordMail(email, otp);
  }

  async refreshToken(id: number, refreshToken: string): Promise<Tokens> {
    const user = await this.userService.findOneById(id);

    const rtMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!rtMatches) {
      throw new AccessDeniedException();
    }

    return await this.getTokens(user);
  }

  async getTokens(user: User): Promise<Tokens> {
    const { id, email, refreshToken: oldRt } = user;

    let accessToken: string;
    let refreshToken = oldRt;

    try {
      await this.jwtService.verify(oldRt, {
        secret: JWT_SECRET_KEY.rt,
      });

      accessToken = await this.generateAccessToken(id, email);
    } catch (err) {
      [accessToken, refreshToken] = await Promise.all([
        this.generateAccessToken(id, email),
        this.generateRefreshToken(id, email),
      ]);
    }

    return {
      accessToken,
      refreshToken,
    };
  }

  async generateAccessToken(id: number, email: string): Promise<string> {
    return this.jwtService.sign(
      {
        sub: id,
        email,
      },
      {
        expiresIn: '1h',
        secret: JWT_SECRET_KEY.at,
      },
    );
  }

  async generateRefreshToken(id: number, email: string): Promise<string> {
    return this.jwtService.sign(
      {
        sub: id,
        email,
      },
      {
        expiresIn: '7d',
        secret: JWT_SECRET_KEY.rt,
      },
    );
  }

  async generateMailToken(email: string): Promise<string> {
    const token = await this.jwtService.signAsync(
      { email },
      { secret: configService.getValue('MAIL_TOKEN_SECRET'), expiresIn: '5m' },
    );

    return token;
  }

  async validateTokenMail(email: string, token: string): Promise<void> {
    let payload: IJWTPayload;

    try {
      payload = await this.jwtService.verify(token, {
        secret: configService.getValue('MAIL_TOKEN_SECRET'),
      });
    } catch (err) {
      throw new InvalidTokenException();
    }

    const { email: encryptedEmail } = payload;
    if (encryptedEmail !== email) {
      throw new InvalidCredentialException();
    }
  }

  async validateUser(id: number, email: string): Promise<User> {
    return this.userService.findOne({ id, email });
  }

  async findOrCreateSocialUser(info: ILoginSocialInfo): Promise<User> {
    const { email, method } = info;

    let user = await this.userService.findOne({ email });

    if (!user) {
      // User login first time
      user = await this.userService.create({
        ...info,
        isVerified: true,
      });
    } else if (method !== info.method) {
      throw new UserExistedException();
    }

    return user;
  }
}
