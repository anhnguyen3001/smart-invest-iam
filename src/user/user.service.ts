import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EntityEnum } from 'common/constants/apiCode';
import { ExistedException, NotFoundException } from 'common/exceptions';
import { QueryBuilderType } from 'common/types/core.type';
import { paginate } from 'common/utils/core';
import { configService } from 'config/config.service';
import { RoleService } from 'role/role.service';
import { LoginMethodEnum, User } from 'storage/entities/user.entity';
import {
  Brackets,
  FindConditions,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import {
  ChangePasswordDto,
  SearchUserDto,
  SearchUsersResponse,
  CreateUserDto,
  UpdateUserDto,
} from './user.dto';
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

  async getListUsers(dto: SearchUserDto): Promise<SearchUsersResponse> {
    const { page = 1, pageSize = 10, getAll, ...rest } = dto;

    const { items, meta } = await paginate(this.getQueryBuilder(rest), {
      limit: pageSize,
      page,
    });

    return {
      users: items,
      pagination: {
        totalItems: meta.totalItems,
        totalPages: meta.totalPages,
      },
    };
  }

  async createUser(data: CreateUserDto): Promise<User> {
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
    console.log('rest');
    const user = await this.userRepo.save(
      this.userRepo.create({
        password: hashPassword,
        method,
        isVerified,
        ...rest,
      }),
    );

    console.log('user ', user);
    const role = await this.roleService.findOneAndThrowNotFound(
      { code: configService.getValue('USER_ROLE_CODE') },
      true,
    );
    console.log('role ', role);
    user.role = role;

    return this.userRepo.save(user);
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const user = await this.findOneAndThrowNotFound({ id }, true);

    const { password, roleId } = data;

    // Update password
    if (password) {
      data.password = await this.hashPassword(password);
    }

    // Update role
    if (roleId) {
      const role = await this.roleService.findOneAndThrowNotFound(
        {
          id: roleId,
        },
        true,
      );

      user.role = role;
      delete data.roleId;
    }

    return this.userRepo.save(this.userRepo.merge(user, data));
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.findOneAndThrowNotFound({ id }, true);

    await this.userRepo.softRemove(user);
  }

  // TODO: BFF
  async changePassword(id: number, data: ChangePasswordDto): Promise<void> {
    data.validate();

    const user = await this.findOneById(id);

    const { oldPassword, newPassword } = data;
    const passwordMatches = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatches) {
      throw new OldPasswordWrongException();
    }

    await this.updateById(id, { password: newPassword });
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

  async findOneAndThrowNotFound(
    condition: Partial<User>,
    throwNotFound?: boolean,
  ): Promise<User> {
    const user = await this.userRepo.findOne(condition);
    if (throwNotFound && !user) {
      throw new NotFoundException(EntityEnum.user);
    }
    return user;
  }

  // TODO: Remove when have BFF
  async findOneById(id: number): Promise<User> {
    return this.userRepo.findOne({ id, isVerified: true });
  }

  async findOne(condition: FindConditions<User>): Promise<User> {
    return this.userRepo.findOne(condition);
  }

  async updateById(id: number, data: Partial<User>): Promise<void> {
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

  getQueryBuilder(
    dto: QueryBuilderType<SearchUserDto>,
  ): SelectQueryBuilder<User> {
    const { q, userIds, orderBy, sortBy, ...rest } = dto;
    let queryBuilder = this.userRepo
      .createQueryBuilder('user')
      .leftJoin('user.role', 'role');

    // search option
    if (q) {
      queryBuilder = queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('user.email LIKE :q', {
            q: `%${q}%`,
          }).orWhere('user.username LIKE :q', {
            q: `%${q}%`,
          });
        }),
      );
    }

    if (userIds) {
      queryBuilder = queryBuilder.andWhere('user.id IN (:...userIds)', {
        userIds,
      });
    }

    // boolean option + string option
    Object.entries(rest).forEach(([k, v]) => {
      if (typeof v === 'boolean' || typeof v === 'string')
        queryBuilder = queryBuilder.andWhere(`user.${k} = :${k}`, {
          [k]: v,
        });
    });

    queryBuilder = queryBuilder.addOrderBy(`user.${sortBy}`, orderBy);

    return queryBuilder;
  }
}
