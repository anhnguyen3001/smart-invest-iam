import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EntityEnum } from 'src/common/constants/apiCode';
import { ExistedException, NotFoundException } from 'src/common/exceptions';
import { QueryBuilderType } from 'src/common/types/core.type';
import { hashData, paginate } from 'src/common/utils/core';
import { RoleService } from 'src/role/role.service';
import { LoginMethodEnum, User } from 'src/storage/entities/user.entity';
import {
  Brackets,
  FindConditions,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import {
  ChangePasswordDto,
  CreateUserDto,
  DetailUserDto,
  SearchUserDto,
  SearchUsersResponse,
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

    if (getAll) {
      const data = await this.getQueryBuilder(rest).getMany();
      return {
        users: data,
        pagination: {
          totalItems: data.length,
          totalPages: 1,
        },
      };
    }

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

  async upsertUser(
    data: CreateUserDto | UpdateUserDto,
    id: number,
  ): Promise<User> {
    const existedUser = await this.userRepo.findOne({ id, email: data.email });

    let newData = data;

    if (id) {
      if (!existedUser) {
        throw new NotFoundException(EntityEnum.user);
      }
    } else {
      if (existedUser.isVerified) {
        throw new ExistedException(EntityEnum.user);
      }

      newData = {
        method: LoginMethodEnum.local,
        isVerified: false,
        ...newData,
      };
    }

    const formattedData = await this.formatUpsertData(newData);

    if (existedUser) {
      return this.userRepo.save(
        this.userRepo.merge(existedUser, formattedData),
      );
    }
    return this.userRepo.save(this.userRepo.create(formattedData));
  }

  async createUser(data: CreateUserDto): Promise<User> {
    const existedUser = await this.userRepo.findOne({ email: data.email });
    if (existedUser?.isVerified) {
      throw new ExistedException(EntityEnum.user);
    }

    const formattedData = await this.formatUpsertData({
      method: LoginMethodEnum.local,
      isVerified: false,
      ...data,
    });

    console.log(formattedData);
    return;

    if (existedUser) {
      return this.userRepo.save(this.userRepo.merge(existedUser, data));
    }

    return this.userRepo.save(this.userRepo.create(formattedData));
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const user = await this.findOneAndThrowNotFound(
      { id, isVerified: true },
      true,
    );

    const formattedData = await this.formatUpsertData(data);
    return this.userRepo.save(this.userRepo.merge(user, formattedData));
  }

  private async formatUpsertData(
    data: CreateUserDto | UpdateUserDto,
  ): Promise<Partial<User>> {
    const { password, method, roleCode, roleId } = data;

    let hashPassword;
    if (method === LoginMethodEnum.local) {
      if (!password) throw new LackPasswordException();

      hashPassword = await hashData(password);
    }

    let role;
    if (roleId || roleCode) {
      role = await this.roleService.findOneAndThrowNotFound(
        { id: roleId, code: roleCode },
        true,
      );
      delete data.roleId;
      delete data.roleCode;
    }

    return {
      ...data,
      password: hashPassword,
      role,
    };
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

  async getUserInfo(id: number, email: string): Promise<DetailUserDto> {
    const user = (await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoin('role_permission', 'rp', 'rp.role_id =  role.id')
      .leftJoinAndMapMany(
        'user.permissions',
        'permissions',
        'permission',
        'permission.id = rp.permission_id',
      )
      .where('user.id = :id', { id })
      .andWhere('user.email = :email', { email })
      .getOne()) as any;
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
    const password = data.password ? await hashData(data.password) : undefined;

    await this.userRepo.update(
      { id },
      {
        ...data,
        ...(password && { password }),
      },
    );
  }

  getQueryBuilder(
    dto: QueryBuilderType<SearchUserDto>,
  ): SelectQueryBuilder<User> {
    const { q, userIds, orderBy, sortBy, ...rest } = dto;
    let queryBuilder = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role');

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
