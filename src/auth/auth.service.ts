import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OtpService } from 'otp/otp.service';
import { Otp, OtpTypeEnum } from 'storage/entities/otp.entity';
import { LoginMethodEnum, User } from 'storage/entities/user.entity';
import { UpdatePasswordDto } from 'user/dto/change-password.dto';
import { MailService } from '../external/mail/mail.service';
import {
  UserExistedException,
  UserNotFoundException,
} from '../user/user.exception';
import { UserService } from '../user/user.service';
import {
  AccessDeniedException,
  InvalidCredentialException,
  UnverifiedUserException,
  VerifiedUserException,
} from './auth.exception';
import { JWT_SECRET_KEY } from './constants';
import {
  ForgetPasswordDto,
  LoginDto,
  ResendOtpQueryDto,
  SignupDto,
  TokenDto,
  VerifyOtpQueryDto,
  VerifyUserQueryDto,
} from './dtos';
import { ILoginSocialInfo } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly otpService: OtpService,
  ) {}

  async login(dto: LoginDto): Promise<TokenDto> {
    dto.validate();

    const { email, password } = dto;

    const user = await this.userService.findVerifiedUserByEmail(email, true);
    if (!user) {
      throw new InvalidCredentialException();
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new InvalidCredentialException();
    }

    return this.getTokens(user);
  }

  async loginSocial(user: User): Promise<TokenDto> {
    return this.getTokens(user);
  }

  async logout(id: number): Promise<void> {
    await this.userService.updateUserById(id, { refreshToken: null });
  }

  async signup(dto: SignupDto): Promise<User> {
    const { confirmPassword, ...restDto } = dto;
    const user = await this.userService.create(restDto);

    this.sendVerifyUserMail(user);

    return user;
  }

  async verifyUser(query: VerifyUserQueryDto): Promise<void> {
    const { email, code } = query;

    const user = await this.userService.findUnverifiedUserByEmail(email, true);
    if (!user) {
      throw new UserNotFoundException();
    }
    if (user.isVerified) {
      throw new VerifiedUserException();
    }

    const otp = await this.otpService.verifyOtp(
      user.id,
      code,
      OtpTypeEnum.verifyUser,
    );

    await Promise.all([
      this.otpService.deleteOtp(otp.id),
      this.userService.updateUserById(user.id, { isVerified: true }),
    ]);
  }

  async forgetPassword(data: ForgetPasswordDto): Promise<void> {
    const { email } = data;

    const user = await this.userService.findVerifiedUserByEmail(email);
    if (!user) {
      throw new UserNotFoundException();
    }

    this.sendForgetPasswordMail(user);
  }

  async verifyOtpResetPassword(query: VerifyOtpQueryDto): Promise<Otp> {
    const { email, code } = query;

    const user = await this.userService.findVerifiedUserByEmail(email, true);
    if (!user) {
      throw new UserNotFoundException();
    }

    return this.otpService.verifyOtp(user.id, code, OtpTypeEnum.resetPassword);
  }

  async recoverPassword(
    query: VerifyOtpQueryDto,
    data: UpdatePasswordDto,
  ): Promise<void> {
    data.validate();

    const { email, code } = query;
    const { newPassword: password } = data;

    const user = await this.userService.findVerifiedUserByEmail(email);
    if (!user) {
      throw new UserNotFoundException();
    }

    const { id: otpId } = await this.otpService.verifyOtp(
      user.id,
      code,
      OtpTypeEnum.resetPassword,
    );

    await Promise.all([
      this.otpService.deleteOtp(otpId),
      this.userService.updateUserById(user.id, { password }),
    ]);
  }

  async resendOtp(data: ResendOtpQueryDto): Promise<void> {
    const { type, email } = data;

    const user = await this.userService.findOne({
      email,
      method: LoginMethodEnum.local,
    });
    if (!user) {
      throw new UserNotFoundException();
    }

    if (type === OtpTypeEnum.verifyUser) {
      if (user.isVerified) {
        throw new VerifiedUserException();
      }

      this.sendVerifyUserMail(user);
    } else {
      if (!user.isVerified) {
        throw new UnverifiedUserException();
      }

      this.sendForgetPasswordMail(user);
    }
  }

  async sendVerifyUserMail(user: User): Promise<void> {
    const otp = await this.otpService.generate(user, OtpTypeEnum.verifyUser);

    await this.mailService.sendVerifyUserMail(user.email, otp);
  }

  async sendForgetPasswordMail(user: User): Promise<void> {
    const otp = await this.otpService.generate(user, OtpTypeEnum.resetPassword);

    await this.mailService.sendForgetPasswordMail(user.email, otp);
  }

  async refreshToken(id: number, refreshToken: string): Promise<TokenDto> {
    const user = await this.userService.findOneById(id);

    const rtMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!rtMatches) {
      throw new AccessDeniedException();
    }

    return await this.getTokens(user);
  }

  async getTokens(user: User): Promise<TokenDto> {
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

  async validateUser(id: number, email: string): Promise<User> {
    return this.userService.findOne({ id, email, isVerified: true });
  }

  async findOrCreateSocialUser(info: ILoginSocialInfo): Promise<User> {
    const { email, method } = info;

    let user = await this.userService.findVerifiedUserByEmail(email);

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
