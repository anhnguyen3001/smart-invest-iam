import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginMethodEnum, User } from 'storage/entities/user.entity';
import { FindConditions, Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import {
  LackPasswordException,
  OldPasswordWrongException,
  UserExistedException,
  UserNotFoundException,
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

      hashPassword = await this.hashPassword(password);
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
    return await this.updateUser(user, data);
  }

  async changePassword(id: number, data: ChangePasswordDto): Promise<User> {
    data.validate();

    const user = await this.findOneById(id);

    const { oldPassword, newPassword } = data;
    const passwordMatches = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatches) {
      throw new OldPasswordWrongException();
    }

    const password = await this.hashPassword(newPassword);

    return this.userRepo.save({
      ...user,
      password,
    });
  }

  async findUnverifiedUserByEmail(
    email: string,
    isLocalLogin = false,
  ): Promise<User> {
    return this.userRepo.findOne({
      email,
      isVerified: false,
      ...(isLocalLogin && {
        method: LoginMethodEnum.local,
      }),
    });
  }

  async findVerifiedUserByEmail(
    email: string,
    isLocalLogin = false,
  ): Promise<User> {
    return this.userRepo.findOne({
      email,
      isVerified: true,
      ...(isLocalLogin && {
        method: LoginMethodEnum.local,
      }),
    });
  }

  async findOneById(id: number): Promise<User> {
    return this.userRepo.findOne({ id });
  }

  async findOne(condition: FindConditions<User>): Promise<User> {
    return this.userRepo.findOne({ where: condition });
  }

  async updateUser(user: User, data: Partial<User>): Promise<User> {
    if (!user) {
      throw new UserNotFoundException();
    }

    const password = data.password
      ? await this.hashPassword(data.password)
      : undefined;

    return this.userRepo.save({ ...user, ...(password && { password }) });
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}
