import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import {
  hashData,
  InvalidCredentialException,
  UserExistedException,
} from 'src/common';
import { MethodEnum, User } from 'src/entities';
import { FindConditions, Repository } from 'typeorm';
import { ChangePasswordDto } from './dto';
import { OldPasswordWrongException } from './user.exception';
import { CreateUser } from './user.type';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(data: CreateUser): Promise<User> {
    const { password, method = MethodEnum.local, ...rest } = data;

    const existedUser = await this.findOneByEmail(data.email);
    if (existedUser) {
      throw new UserExistedException();
    }

    let hashPassword;
    if (method === MethodEnum.local) {
      if (!password) throw new InvalidCredentialException();

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
