import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET_KEY, STRATEGY } from 'src/auth/constants';
import { IJWTPayload } from 'src/auth/interfaces';
import { UserService } from 'src/user/user.service';
import { UnAuthorizedException } from '../auth.exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, STRATEGY.at) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET_KEY.at,
    });
  }

  async validate(payload: IJWTPayload) {
    const { sub: id, email } = payload;
    const user = await this.userService.getUserInfo(id, email);
    if (!user) {
      throw new UnAuthorizedException();
    }

    return user;
  }
}
