import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ILoginSocialInfo } from 'auth/interfaces';
import { STRATEGY } from 'common/constants/strategy-name';
import { configService } from 'config/config.service';
import { Profile, Strategy } from 'passport-google-token';
import { LoginMethodEnum } from 'storage/entities/user.entity';
import { AuthService } from '../auth.service';

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

    const socialInfo: ILoginSocialInfo = {
      email: emails[0].value,
      username: displayName,
      avatar: _json.picture,
      method: LoginMethodEnum.google,
    };

    return this.authService.findOrCreateSocialUser(socialInfo);
  }
}
