import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as speakeasy from 'speakeasy';
import { Otp, OtpTypeEnum } from 'storage/entities/otp.entity';
import { User } from 'storage/entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import {
  InvalidCodeException,
  RecentlySentOtpException,
} from './otp.exception';

@Injectable()
export class OtpService {
  private encoding: speakeasy.Encoding = 'base32';

  constructor(@InjectRepository(Otp) private otpRepo: Repository<Otp>) {}

  async generate(user: User, type: OtpTypeEnum): Promise<string> {
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
}
