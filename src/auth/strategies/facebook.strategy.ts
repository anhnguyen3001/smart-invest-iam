import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ILoginSocialInfo } from 'auth/interfaces';
import { STRATEGY } from 'common/constants/strategy-name';
import { configService } from 'config/config.service';
import { Profile, Strategy } from 'passport-facebook-token-nest';
import { LoginMethodEnum } from 'storage/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(
  Strategy,
  STRATEGY.facebook,
) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: configService.getValue('FB_APP_ID'),
      clientSecret: configService.getValue('FB_APP_SECRET'),
      scope: 'email',
      profileFields: ['emails', 'displayName', 'photos'],
    });
  }

  async validate(_: string, __: string, profile: Profile): Promise<any> {
    const { emails, name, photos } = profile;

    const socialInfo: ILoginSocialInfo = {
      email: emails[0].value,
      username: name,
      avatar: photos[0].value,
      method: LoginMethodEnum.facebook,
    };

    return this.authService.findOrCreateSocialUser(socialInfo);
  }
}
