import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook-token-nest';
import { STRATEGY } from 'src/common';
import { configService } from 'src/config';
import { AuthService } from '../auth.service';
import { LoginSocialInfo } from '../common';

@Injectable()
export class FacebookStrategy extends PassportStrategy(
  Strategy,
  STRATEGY.facebook,
) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: configService.getValue('FB_APP_ID'),
      clientSecret: configService.getValue('FB_APP_SECRET'),
      callbackURL: configService.getValue('FB_APP_CALLBACK'),
      scope: 'email',
      profileFields: ['emails', 'displayName', 'photos'],
    });
  }

  async validate(_: string, __: string, profile: Profile): Promise<any> {
    const { emails, name, photos } = profile;

    const socialInfo: LoginSocialInfo = {
      email: emails[0].value,
      username: name,
      avatar: photos[0].value,
    };

    return this.authService.validateFBUser(socialInfo);
  }
}
