import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { configService } from 'src/config';
import { MailToken, User } from 'src/entities';
import { MoreThan, Repository } from 'typeorm';
import { RecentlyCreateException } from './mail-token.exception';
import { CreateMailToken, MailTokenTypeEnum } from './mail-token.type';

@Injectable()
export class MailTokenService {
  constructor(
    @InjectRepository(MailToken) private mailTokenRepo: Repository<MailToken>,
    private readonly jwtService: JwtService,
  ) {}

  async generate(
    user: User,
    email: string,
    type: MailTokenTypeEnum,
  ): Promise<string> {
    const existedTokens = await this.mailTokenRepo.find({
      relations: ['user'],
      where: {
        user: { id: user.id },
        type,
        expiredAt: MoreThan(new Date()),
      },
    });
    if (existedTokens.length) {
      throw new RecentlyCreateException();
    }

    const expiredMinutes = 5;
    const token = await this.jwtService.signAsync(
      { email },
      {
        secret: configService.getValue('MAIL_TOKEN_SECRET'),
        expiresIn: `${expiredMinutes}m`,
      },
    );

    const tokenEntity = await this.create({
      token: token,
      type,
      user,
      expiredAt: new Date(
        new Date().getTime() + expiredMinutes * 60 * 1000,
      ).toISOString(),
    });

    return tokenEntity.token;
  }

  private async create(data: CreateMailToken) {
    return this.mailTokenRepo.save(this.mailTokenRepo.create(data));
  }
}
