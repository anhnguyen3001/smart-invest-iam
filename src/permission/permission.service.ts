import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityEnum } from 'common/constants/apiCode';
import { ExistedException } from 'common/exceptions';
import { paginate } from 'common/utils/core';
import { Permission } from 'storage/entities/permission.entity';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import {
  CreatePermissionDto,
  SearchPermissionDto,
  SearchPermissionsResponse,
  UpdatePermissionDto,
} from './permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
  ) {}

  async getListPermissions(
    dto: SearchPermissionDto,
  ): Promise<SearchPermissionsResponse> {
    const { page = 1, pageSize = 10 } = dto;

    const {
      items,
      meta: { totalItems, totalPages },
    } = await paginate(this.getQueryBuilder(dto), {
      limit: pageSize,
      page,
    });

    return {
      permissions: items,
      pagination: {
        totalItems,
        totalPages,
      },
    };
  }

  async createPermission(data: CreatePermissionDto): Promise<Permission> {
    const permission = await this.permissionRepo.findOne({ code: data.code });
    if (permission) {
      throw new ExistedException(EntityEnum.permission);
    }

    return this.permissionRepo.save(this.permissionRepo.create(data));
  }

  async updatePermission(
    id: number,
    data: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.findOneAndThrowNotFound({ id }, true);
    this.permissionRepo.merge(permission, data);
    return this.permissionRepo.save(permission);
  }

  async deletePermission(id: number): Promise<void> {
    const permission = await this.findOneAndThrowNotFound({ id }, true);
    await this.permissionRepo.softRemove(permission);
  }

  async findManyByIds(ids: number[]): Promise<Permission[]> {
    return this.permissionRepo
      .createQueryBuilder('permission')
      .where('permission.id IN (:...ids)', { ids })
      .getMany();
  }

  async findOneAndThrowNotFound(
    condition: Partial<Permission>,
    throwNotFound?: boolean,
  ): Promise<Permission> {
    const permission = await this.permissionRepo.findOne(condition);
    if (throwNotFound && !permission) {
      throw new NotFoundException(EntityEnum.permission);
    }
    return permission;
  }

  getQueryBuilder(dto: SearchPermissionDto): SelectQueryBuilder<Permission> {
    const { page, pageSize, q, orderBy, sortBy, ...rest } = dto;
    let queryBuilder = this.permissionRepo.createQueryBuilder('permission');

    // search option
    if (q) {
      queryBuilder = queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('permission.id = :id', { id: q }).orWhere(
            'permission.name LIKE :q',
            {
              q: `%${q}%`,
            },
          );
        }),
      );
    }

    // boolean option + string option
    Object.entries(rest).forEach(([k, v]) => {
      if (typeof v === 'boolean' || typeof v === 'string')
        queryBuilder = queryBuilder.andWhere(`perrmission.${k} = :${k}`, {
          [k]: v,
        });
    });

    queryBuilder = queryBuilder.addOrderBy(`perrmission.${sortBy}`, orderBy);

    return queryBuilder;
  }
}
