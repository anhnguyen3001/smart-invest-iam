import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { hashData, LoginMethodEnum } from 'src/common';
import { User } from 'src/entities';
import { FindConditions, Repository } from 'typeorm';
import { ChangePasswordDto, CreateUserDto } from './dto';
import {
  OldPasswordWrongException,
  UserExistedException,
  LackPasswordException,
} from './user.exception';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(data: CreateUserDto): Promise<User> {
    const { password, method = LoginMethodEnum.local, ...rest } = data;

    const existedUser = await this.userRepo.findOne({
      where: [{ email: data.email }],
    });
    if (existedUser) {
      throw new UserExistedException();
    }

    let hashPassword;
    if (method === LoginMethodEnum.local) {
      if (!password) throw new LackPasswordException();

      hashPassword = await hashData(password);
    }

    return this.userRepo.save(
      this.userRepo.create({
        password: hashPassword,
        method,
        ...rest,
      }),
    );
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const user = await this.findOneById(id);

    return this.userRepo.save({
      ...user,
      ...data,
    });
  }

  async changePassword(id: number, data: ChangePasswordDto): Promise<User> {
    data.validate();

    const user = await this.findOneById(id);

    const { oldPassword, newPassword } = data;
    const passwordMatches = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatches) {
      throw new OldPasswordWrongException();
    }

    const password = await hashData(newPassword);

    return this.userRepo.save({
      ...user,
      password,
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepo.findOne({ email });
  }

  async findOneById(id: number): Promise<User> {
    return this.userRepo.findOne({ id });
  }

  async findOne(condition: FindConditions<User>): Promise<User> {
    return this.userRepo.findOne({ where: condition });
  }
}
