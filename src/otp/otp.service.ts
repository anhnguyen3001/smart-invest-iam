import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as speakeasy from 'speakeasy';
import {
  UnverifiedUserException,
  VerifiedUserException,
} from 'src/auth/auth.exception';
import { MailService } from 'src/external/mail/mail.service';
import { Otp, OtpTypeEnum } from 'src/storage/entities/otp.entity';
import { LoginMethodEnum, User } from 'src/storage/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { MoreThan, Repository } from 'typeorm';
import { SendOtpDto } from './otp.dto';
import {
  InvalidCodeException,
  RecentlySentOtpException,
} from './otp.exception';

@Injectable()
export class OtpService {
  private encoding: speakeasy.Encoding = 'base32';

  constructor(
    @InjectRepository(Otp) private otpRepo: Repository<Otp>,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  async sendOtp(data: SendOtpDto, validateLimitTime = true): Promise<void> {
    const { email, type } = data;

    const user = await this.userService.findOneAndThrowNotFound(
      { email, method: LoginMethodEnum.local },
      true,
    );

    if (type === OtpTypeEnum.verifyUser) {
      if (user.isVerified) {
        throw new VerifiedUserException();
      }
    } else {
      if (!user.isVerified) {
        throw new UnverifiedUserException();
      }
    }

    const otp = await this.generate(user, type, validateLimitTime);
    await this.mailService.sendEmail(email, otp, type);
  }

  async generate(
    user: User,
    type: OtpTypeEnum,
    validateLimitTime = true,
  ): Promise<string> {
    if (validateLimitTime) {
      const existedOtps = await this.otpRepo.find({
        relations: ['user'],
        where: {
          user: { id: user.id },
          type,
          expiredAt: MoreThan(new Date()),
        },
      });
      if (existedOtps.length) {
        throw new RecentlySentOtpException();
      }
    }

    const expiredSeconds = 5 * 60;
    const { base32: otpSecret } = speakeasy.generateSecret();
    const otp = speakeasy.time({
      secret: otpSecret,
      encoding: this.encoding,
      step: expiredSeconds,
    });

    await this.otpRepo.save(
      this.otpRepo.create({
        user,
        type,
        secret: otpSecret,
        expiredAt: new Date(
          new Date().getTime() + expiredSeconds * 1000,
        ).toISOString(),
      }),
    );

    return otp;
  }

  async verifyOtp(
    userId: number,
    code: string,
    type: OtpTypeEnum,
  ): Promise<Otp> {
    const otps = await this.otpRepo.find({
      relations: ['user'],
      where: { user: { id: userId }, type, expiredAt: MoreThan(new Date()) },
      order: {
        expiredAt: 'DESC',
      },
      take: 1,
    });
    if (!otps.length) {
      throw new InvalidCodeException();
    }

    const { secret } = otps[0];
    const isValid = speakeasy.time.verify({
      secret,
      token: code,
      encoding: this.encoding,
      step: 5 * 60,
    });
    if (!isValid) {
      throw new InvalidCodeException();
    }

    return otps[0];
  }

  async deleteOtp(id: number): Promise<void> {
    await this.otpRepo.softDelete({ id });
  }
}
