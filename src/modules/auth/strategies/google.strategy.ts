import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-token';
import { LoginMethodEnum, STRATEGY } from 'src/common';
import { configService } from 'src/config';
import { AuthService } from '../auth.service';
import { LoginSocialInfo } from '../common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  STRATEGY.google,
) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: configService.getValue('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getValue('GOOGLE_CLIENT_SECRET'),
    });
  }

  async validate(_: string, __: string, profile: Profile): Promise<any> {
    const { emails, displayName, _json } = profile;

    const socialInfo: LoginSocialInfo = {
      email: emails[0].value,
      username: displayName,
      avatar: _json.picture,
      method: LoginMethodEnum.google,
    };

    return this.authService.findOrCreateSocialUser(socialInfo);
  }
}
