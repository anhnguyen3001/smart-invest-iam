import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { configService } from 'src/config';
import { User } from 'src/entities';
import { MailService } from '../external/mail/mail.service';
import { UserService } from '../user/user.service';
import { AccessDeniedException, UnAuthorizedException } from './auth.exception';
import { JWT_SECRET_KEY } from './common';
import { LoginDto, SignupDto, TokenDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async login(dto: LoginDto): Promise<TokenDto> {
    const { email, password } = dto;

    const user = await this.userService.findOne({ email, isVerified: true });
    if (!user) {
      throw new UnAuthorizedException();
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnAuthorizedException();
    }

    return this.getTokens(user);
  }

  async logout(id: number): Promise<void> {
    await this.userService.update(id, { refreshToken: null });
  }

  async signup(dto: SignupDto): Promise<User> {
    const user = await this.userService.create(dto);

    const token = await this.jwtService.signAsync(
      { email: user.email },
      { secret: configService.getValue('MAIL_TOKEN_SECRET'), expiresIn: '5m' },
    );
    await this.mailService.sendRegisterEmail(user.email, token);

    return user;
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

    let accessToken;
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

  async generateTokens(id: number, email: string): Promise<TokenDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(
        {
          sub: id,
          email,
        },
        {
          expiresIn: '1h',
          secret: JWT_SECRET_KEY.at,
        },
      ),
      this.jwtService.sign(
        {
          sub: id,
          email,
        },
        {
          expiresIn: '7d',
          secret: JWT_SECRET_KEY.rt,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(id: number, email: string): Promise<User> {
    return this.userService.findOne({ id, email });
  }
}
