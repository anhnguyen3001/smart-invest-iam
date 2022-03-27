import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { hashData } from 'src/common';
import { configService } from 'src/config';
import { User } from 'src/entities';
import { MailService } from '../external/mail/mail.service';
import { UserExistedException } from '../user/user.exception';
import { UserService } from '../user/user.service';
import { LoginMethodEnum } from '../user/user.type';
import {
  AccessDeniedException,
  EmailValidatedException,
  InvalidCredentialException,
  InvalidTokenException,
  UserNotFoundException,
} from './auth.exception';
import { JWTPayload, JWT_SECRET_KEY, LoginSocialInfo } from './common';
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

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
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

  async loginFB(user: User): Promise<Tokens> {
    return this.getTokens(user);
  }

  async logout(id: number): Promise<void> {
    await this.userService.update(id, { refreshToken: null });
  }

  async signup(dto: SignupDto): Promise<User> {
    const { confirmPassword, ...restDto } = dto;
    const user = await this.userService.create(restDto);

    await this.sendVerifyUserMail(user.email);

    return user;
  }

  async verifyUser(query: VerifyUserQueryDto): Promise<void> {
    const { email, token } = query;

    await this.validateTokenMail(email, token);

    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UserNotFoundException();
    }

    if (user.isVerified) {
      throw new EmailValidatedException();
    }

    this.userService.update(user.id, { isVerified: true });
  }

  async forgetPassword(data: ForgetPasswordDto): Promise<void> {
    const { email } = data;

    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UserNotFoundException();
    }

    await this.sendForgetPasswordMail(email);
  }

  async resetPassword(
    query: ResetPasswordQuery,
    data: ResetPasswordDto,
  ): Promise<void> {
    data.validate();

    const { email, token } = query;
    const { password } = data;

    await this.validateTokenMail(email, token);

    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UserNotFoundException();
    }

    const hashPassword = await hashData(password);
    await this.userService.update(user.id, { password: hashPassword });
  }

  async resendMail(data: ResendMailQueryDto): Promise<void> {
    const { type, email } = data;

    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UserNotFoundException();
    }

    if (type === MailEnum.register) {
      await this.sendVerifyUserMail(email);
    } else if (type === MailEnum.resetPassword) {
      await this.sendForgetPasswordMail(email);
    }
  }

  async sendVerifyUserMail(email: string): Promise<void> {
    const token = await this.generateMailToken(email);
    await this.mailService.sendVerifyUserMail(email, token);
  }

  async sendForgetPasswordMail(email: string): Promise<void> {
    const token = await this.generateMailToken(email);
    await this.mailService.sendForgetPasswordMail(email, token);
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
    let payload: JWTPayload;

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

  async validateFBUser(user: LoginSocialInfo): Promise<User> {
    const { email } = user;

    let currentUser = await this.userService.findOneByEmail(email);

    if (!currentUser) {
      // User login first time
      currentUser = await this.userService.create({
        ...user,
        isVerified: true,
        method: LoginMethodEnum.facebook,
      });
    } else {
      const { method } = currentUser;
      if (method !== LoginMethodEnum.facebook) {
        throw new UserExistedException();
      }
    }

    return currentUser;
  }
}
