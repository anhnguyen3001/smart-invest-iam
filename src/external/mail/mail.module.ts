import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { configService } from 'src/config/config.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: configService.getValue('MAIL_ACCOUNT'),
          pass: configService.getValue('MAIL_PASS'),
        },
      },
      defaults: {
        from: `AH Ticker <${configService.getValue('MAIL_ACCOUNT')}>`,
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
