import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities';
import { UserService } from '../user/user.service';
import { AccessDeniedException, UnAuthorizedException } from './auth.exception';
import { JWT_SECRET_KEY } from './common';
import { LoginDto, SignupDto, TokenDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<TokenDto> {
    const { email, password } = dto;

    const user = await this.userService.findOneByEmail(email);
    if (!user || !user.isVerified) {
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
    return this.userService.create(dto);
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
    const { id, email, refreshToken } = user;

    const tokens = await this.generateTokens(id, email);

    const isRtValidate = refreshToken
      ? await this.jwtService.verify(refreshToken, {
          secret: JWT_SECRET_KEY.rt,
        })
      : false;

    if (isRtValidate) {
      return { ...tokens, refreshToken };
    }

    await this.userService.update(user.id, {
      refreshToken: tokens.refreshToken,
    });
    return tokens;
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
