import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { configService } from 'src/config';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendVerifyUserMail(email: string, token: string) {
    const url = `${configService.getValue(
      'CLIENT_DOMAIN',
    )}/verify?email=${email}&token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirm your Email',
      html: `<div style="width: 640px; text-align: center; margin: auto; padding: 10px 20px 25px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"><h2 style="margin: 0; font-size: 30px;">Welcome to AH Ticker Community</h2><p style="margin: 24px 0 30px; text-align: left;">Thank you for creating an account in our app. To complete the registration process, please click this button below to verify your e-mail address.</p><a href="${url}"><button style=" background-color: #000A19; color: #fff; border: none; padding: 16px 25px; font-size: 16px; cursor: pointer; border-radius: 4px;">Verify your e-mail</button></a><p style=" margin: 6px 0 0; text-align: left; font-size: 13px;">The AH Ticker Team</p></div>`,
    });
  }

  async sendForgetPasswordMail(email: string, token: string) {
    const url = `${configService.getValue(
      'CLIENT_DOMAIN',
    )}/reset-password?email=${email}&token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset password',
      html: `<div style="width: 640px; text-align: center; margin: auto; padding: 10px 20px 25px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"><h2 style="margin: 0; font-size: 30px;">Welcome to AH Ticker Community</h2><p style="margin: 24px 0 30px; text-align: left;">We got a request to reset your password. To complete the process, please click this button below.</p><a href="${url}"><button style="background-color: #000A19; color: #fff; border: none; padding: 16px 25px; font-size: 16px; cursor: pointer; border-radius: 4px;">Reset password</button></a><p style=" margin: 6px 0 0; text-align: left; font-size: 13px;">The AH Ticker Team</p></div>`,
    });
  }
}
