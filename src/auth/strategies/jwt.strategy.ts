import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JWT_SECRET_KEY } from 'auth/constants';
import { IJWTPayload } from 'auth/interfaces';
import { STRATEGY } from 'common/constants/strategy-name';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UnAuthorizedException } from '../auth.exception';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, STRATEGY.at) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET_KEY.at,
    });
  }

  async validate(payload: IJWTPayload) {
    const { sub: id, email } = payload;
    const user = await this.authService.validateUser(id, email);
    if (!user) {
      throw new UnAuthorizedException();
    }

    return { id, email };
  }
}
