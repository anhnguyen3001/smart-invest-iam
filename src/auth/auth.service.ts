import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EntityEnum } from 'src/common/constants/apiCode';
import { ExistedException } from 'src/common/exceptions';
import { OtpService } from 'src/otp/otp.service';
import { RouteService } from 'src/route/route.service';
import { OtpTypeEnum } from 'src/storage/entities/otp.entity';
import { LoginMethodEnum, User } from 'src/storage/entities/user.entity';
import { DetailUserDto } from 'src/user/user.dto';
import { UserService } from '../user/user.service';
import {
  ForgetPasswordDto,
  LoginDto,
  RecoverPasswordDto,
  SignupDto,
  TokenResult,
  VerifyOtpDto,
} from './auth.dto';
import {
  AccessDeniedException,
  IncorrectEmailPasswordException,
  VerifiedUserException,
} from './auth.exception';
import { JWT_SECRET_KEY } from './constants';
import { ILoginSocialInfo } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly routeService: RouteService,
  ) {}

  async login(dto: LoginDto): Promise<TokenResult> {
    dto.validate();
    const { email, password, method, path } = dto;

    const user = await this.userService.findVerifiedUserByEmail(email, true);
    if (!user) {
      throw new IncorrectEmailPasswordException();
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new IncorrectEmailPasswordException();
    }

    const isAllowToLogin = await this.routeService.validateRoutePermission({
      method,
      path,
      userId: user.id,
    });

    if (!isAllowToLogin) {
      throw new IncorrectEmailPasswordException();
    }

    return this.getTokens(user);
  }

  async loginSocial(user: User): Promise<TokenResult> {
    return this.getTokens(user);
  }

  async logout(id: number): Promise<void> {
    await this.userService.updateById(id, { refreshToken: null });
  }

  async signup(dto: SignupDto): Promise<User> {
    dto.validate();

    const { confirmPassword, sendVerifiedEmail, ...restDto } = dto;

    const user = await this.userService.createUser(restDto);

    if (sendVerifiedEmail) {
      await this.otpService.sendOtp(
        {
          email: user.email,
          type: OtpTypeEnum.verifyUser,
        },
        false,
      );
    }

    return user;
  }

  async verifyUser(query: VerifyOtpDto): Promise<void> {
    const { email, code } = query;

    const user = await this.userService.findOneAndThrowNotFound({ email });
    if (user.isVerified) {
      throw new VerifiedUserException();
    }

    const otp = await this.otpService.verifyOtp(
      user.id,
      code,
      OtpTypeEnum.verifyUser,
    );

    await Promise.all([
      this.userService.updateById(user.id, { isVerified: true }),
      this.otpService.deleteOtp(otp.id),
    ]);
  }

  async forgetPassword(data: ForgetPasswordDto): Promise<void> {
    const { email } = data;
    await this.otpService.sendOtp({ email, type: OtpTypeEnum.resetPassword });
  }

  async recoverPassword(data: RecoverPasswordDto): Promise<void> {
    data.validate();

    const { password, code, email } = data;
    const { id } = await this.userService.findOneAndThrowNotFound(
      { email, isVerified: true, method: LoginMethodEnum.local },
      true,
    );

    await this.otpService.verifyOtp(id, code, OtpTypeEnum.resetPassword);

    await this.userService.updateById(id, { password });
  }

  async refreshToken(id: number, refreshToken: string): Promise<TokenResult> {
    const user = await this.userService.findOneById(id);

    const rtMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!rtMatches) {
      throw new AccessDeniedException();
    }

    return await this.getTokens(user);
  }

  async getTokens(user: User): Promise<TokenResult> {
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
        expiresIn: '7d',
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

  async validateUser(id: number, email: string): Promise<DetailUserDto> {
    return this.userService.getUserInfo(id, email);
  }

  async findOrCreateSocialUser(info: ILoginSocialInfo): Promise<User> {
    const { email, method } = info;

    let user = await this.userService.findVerifiedUserByEmail(email);

    if (!user) {
      // User login first time
      user = await this.userService.createUser({
        ...info,
        isVerified: true,
      });
    } else if (method !== info.method) {
      throw new ExistedException(EntityEnum.user);
    }

    return user;
  }
}
