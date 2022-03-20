import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { configService } from 'src/config';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendRegisterEmail(email: string, token: string) {
    const url = `http://${configService.getValue(
      'SERVER_HOST',
    )}/v1/user/validate?email=${email}&token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirm your Email',
      html: `<div style="width: 640px; text-align: center; margin: auto; padding: 10px 20px 25px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"><h1 style="margin: 0; font-size: 30px;">Welcome to Life Music App</h1><p style="margin: 24px 0 30px; text-align: left;">Thank you for creating an account in our app. To complete the registration process, please click this button below to verify your e-mail address.</p><a href="${url}"><button style=" background-color: #000A19; color: #fff; border: none; padding: 16px 25px;   font-size: 16px; cursor: pointer; border-radius: 4px;">Verify your e-mail</button></a><p style="margin: 30px 0 0; text-align: left;">Welcome to AH Ticker Community!</p><p style=" margin: 6px 0 0; text-align: left; font-size: 13px;">The AH Ticker Team</p></div>`,
    });
  }
}
