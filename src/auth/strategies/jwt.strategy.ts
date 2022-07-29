import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JWT_SECRET_KEY } from 'src/auth/constants';
import { IJWTPayload } from 'src/auth/interfaces';
import { STRATEGY } from '../constants';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UnAuthorizedException } from '../auth.exception';
import { UserService } from 'src/user/user.service';

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

    return user;
  }
}
