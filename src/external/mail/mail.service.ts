import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendVerifyUserMail(email: string, otp: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirm your Email',
      html: `<div style="width:640px;text-align:center;margin:auto;padding:10px 20px 25px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"><h2 style="margin:0;font-size:30px;">Welcome to AH Ticker Community</h2><p style="margin:24px 0 30px;text-align:left;">Thank you for creating an account in our app. To complete the registration process, please enter the verification code below:</p><p style="font-size:17px;font-family:Roboto;font-weight:700">${otp}</p><p style=" margin:6px 0 0;text-align:left;font-size:13px;">The AH Ticker Team</p></div>`,
    });
  }

  async sendForgetPasswordMail(email: string, otp: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset password',
      html: `<div style="width:640px;text-align:center;margin:auto;padding:10px 20px 25px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"><h2 style="margin:0;font-size:30px;">Welcome to AH Ticker Community</h2><p style="margin:24px 0 30px;text-align:left;">We got a request to reset your password. To complete the registration process, please enter the verification code below:</p><p style="font-size:17px;font-family:Roboto;font-weight:700">${otp}</p<p style=" margin:6px 0 0;text-align:left;font-size:13px;">The AH Ticker Team</p></div>`,
    });
  }
}
