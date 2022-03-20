import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { STRATEGY } from 'src/common';
import { UnAuthorizedException } from '../auth.exception';
import { AuthService } from '../auth.service';
import { JWTPayload, JWT_SECRET_KEY } from '../common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, STRATEGY.at) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET_KEY.at,
    });
  }

  async validate(payload: JWTPayload) {
    const { sub: id, email } = payload;

    const user = await this.authService.validateUser(id, email);
    if (!user) {
      throw new UnAuthorizedException();
    }

    return { id, email };
  }
}
