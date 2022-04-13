import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginMethodEnum, User } from 'storage/entities/user.entity';
import { FindConditions, Repository } from 'typeorm';
import { ICreateUser, ChangePasswordDto } from './user.dto';
import {
  LackPasswordException,
  OldPasswordWrongException,
  UserExistedException,
  UserNotFoundException,
} from './user.exception';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(data: ICreateUser): Promise<User> {
    const {
      password,
      method = LoginMethodEnum.local,
      isVerified = false,
      ...rest
    } = data;

    const existedUser = await this.findVerifiedUserByEmail(data.email);
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
        isVerified,
        ...rest,
      }),
    );
  }

  async updateProfile(id: number, data: Partial<User>): Promise<void> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new UserNotFoundException();
    }
    await this.updateUserById(user.id, data);
  }

  async changePassword(id: number, data: ChangePasswordDto): Promise<void> {
    data.validate();

    const user = await this.findOneById(id);
    if (!user) {
      throw new UserNotFoundException();
    }

    const { oldPassword, newPassword } = data;
    const passwordMatches = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatches) {
      throw new OldPasswordWrongException();
    }

    await this.updateUserById(id, { password: newPassword });
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
    return this.userRepo.findOne({ id, isVerified: true });
  }

  async findOne(condition: FindConditions<User>): Promise<User> {
    return this.userRepo.findOne({ where: condition });
  }

  async updateUserById(id: number, data: Partial<User>): Promise<void> {
    const password = data.password
      ? await this.hashPassword(data.password)
      : undefined;

    await this.userRepo.update(
      { id },
      {
        ...data,
        ...(password && { password }),
      },
    );
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}
