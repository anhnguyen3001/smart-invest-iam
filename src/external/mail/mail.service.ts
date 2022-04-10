import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendVerifyUserMail(email: string, otp: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirm your Email',
      html: `<div style="width:640px;margin:auto;padding:10px 20px 25px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"><h2 style="margin:0;paddimng-bottom:8px;border-bottom:1px solid #d0d0d0;font-size:30px;">AH Ticker</h2><p style="margin:16px 0 20px;">Thank you for creating an account in our app. To complete the registration process, please enter the verification code below:</p><p style="font-size:18px;font-family:Roboto;font-weight:700">${otp}</p><p style=" margin:6px 0 0;font-size:13px;">The AH Ticker Team</p></div>`,
    });
  }

  async sendForgetPasswordMail(email: string, otp: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset password',
      html: `<div style="width:640px;margin:auto;padding:10px 20px 25px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"><h2 style="margin:0;paddimng-bottom:8px;border-bottom:1px solid #d0d0d0;font-size:30px;">AH Ticker</h2><p style="margin:16px 0 20px;">We got a request to reset your password. To complete the registration process, please enter the verification code below:</p><p style="font-size:18px;font-family:Roboto;font-weight:700">${otp}</p<p style=" margin:6px 0 0;font-size:13px;">The AH Ticker Team</p></div>`,
    });
  }
}
