import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EntityEnum } from 'common/constants/apiCode';
import { ExistedException, NotFoundException } from 'common/exceptions';
import { configService } from 'config/config.service';
import { RoleService } from 'role/role.service';
import { LoginMethodEnum, User } from 'storage/entities/user.entity';
import { FindConditions, Repository } from 'typeorm';
import { ICreateUser, ChangePasswordDto } from './user.dto';
import {
  LackPasswordException,
  OldPasswordWrongException,
} from './user.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly roleService: RoleService,
  ) {}

  async create(data: ICreateUser): Promise<User> {
    const {
      password,
      method = LoginMethodEnum.local,
      isVerified = false,
      ...rest
    } = data;

    const existedUser = await this.findVerifiedUserByEmail(data.email);
    if (existedUser) {
      throw new ExistedException(EntityEnum.user);
    }

    let hashPassword;
    if (method === LoginMethodEnum.local) {
      if (!password) throw new LackPasswordException();

      hashPassword = await this.hashPassword(password);
    }

    const user = await this.userRepo.save(
      this.userRepo.create({
        password: hashPassword,
        method,
        isVerified,
        ...rest,
      }),
    );

    const role = await this.roleService.findOneByCode(
      configService.getValue('USER_ROLE_CODE'),
    );
    if (!role) {
      throw new NotFoundException(EntityEnum.role);
    }

    await this.userRepo.update(
      { id: user.id },
      {
        ...user,
        role,
      },
    );

    return user;
  }

  async update(id: number, data: Partial<User>): Promise<void> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(EntityEnum.user);
    }

    await this.updateUserById(id, data);
  }

  async changePassword(id: number, data: ChangePasswordDto): Promise<void> {
    data.validate();

    const user = await this.findOneById(id);

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
    return this.userRepo.findOne(condition);
  }

  async findBy(condition: FindConditions<User>): Promise<User[]> {
    return this.userRepo.find(condition);
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
