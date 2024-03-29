import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { STRATEGY } from '../constants';
import { UnAuthorizedException } from '../auth.exception';
import { AuthService } from '../auth.service';
import { JWT_SECRET_KEY } from 'src/auth/constants';
import { IJWTPayload } from 'src/auth/interfaces';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, STRATEGY.rt) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET_KEY.rt,
    });
  }

  async validate(req: Request, payload: IJWTPayload) {
    const { sub: id, email } = payload;

    const user = await this.authService.validateUser(id, email);
    if (!user) {
      throw new UnAuthorizedException();
    }

    const refreshToken = req.body['refreshToken'];
    if (!refreshToken) {
      throw new UnAuthorizedException();
    }

    return { id, email: email, refreshToken };
  }
}
