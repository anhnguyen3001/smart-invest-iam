import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityEnum } from 'common/constants/apiCode';
import { Pagination } from 'common/dto';
import { ExistedException, NotFoundException } from 'common/exceptions';
import { paginate } from 'common/utils/core';
import { PermissionService } from 'permission/permission.service';
import { Role } from 'storage/entities/role.entity';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { UserService } from 'user/user.service';
import { CreateRoleDto, SearchRoleDto, UpdateRoleDto } from './role.dto';
import { RemovedUsedRoleException } from './role.exception';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly permisionService: PermissionService,
  ) {}

  async getListRoles(dto: SearchRoleDto): Promise<{
    pagination: Pagination;
    roles: Role[];
  }> {
    const { page = 1, pageSize = 10 } = dto;

    const { items, meta } = await paginate(this.getQueryBuilder(dto), {
      limit: pageSize,
      page,
    });

    return {
      roles: items,
      pagination: {
        totalItems: meta.totalItems,
        totalPages: meta.totalPages,
      },
    };
  }

  async createRole(data: CreateRoleDto): Promise<Role> {
    const { name, code } = data;

    const role = await this.findOneByCode(code);
    if (role) {
      throw new ExistedException(EntityEnum.role);
    }

    return this.roleRepo.save(this.roleRepo.create({ name, code }));
  }

  async updateRole(id: number, data: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRepo.findOne({ id });
    if (!role) {
      throw new NotFoundException(EntityEnum.role);
    }

    const { permissionIds, ...restData } = data;
    if (permissionIds?.length) {
      const permissions = await this.permisionService.findManyByIds(
        permissionIds,
      );
      if (permissions?.length !== permissionIds.length) {
        throw new NotFoundException(EntityEnum.permission);
      }

      delete data.permissionIds;
      role.permissions = permissions;
    }

    this.roleRepo.merge(role, restData);
    return this.roleRepo.save(role);
  }

  async deleteRole(id: number): Promise<void> {
    const role = await this.roleRepo.findOne({ id });
    if (!role) {
      throw new NotFoundException(EntityEnum.role);
    }

    const users = await this.userService.findBy({ role: { id } });
    if (users.length) {
      throw new RemovedUsedRoleException();
    }

    await this.roleRepo.softRemove(role);
  }

  async findOneByCode(code: string): Promise<Role> {
    return this.roleRepo.findOne({ code });
  }

  getQueryBuilder(dto: SearchRoleDto): SelectQueryBuilder<Role> {
    const { page, pageSize, q, orderBy, sortBy, ...rest } = dto;
    let queryBuilder = this.roleRepo.createQueryBuilder('role');

    // search option
    if (q) {
      queryBuilder = queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('block.id = :id', { id: q }).orWhere('block.name LIKE :q', {
            q: `%${q}%`,
          });
        }),
      );
    }

    // boolean option + string option
    Object.entries(rest).forEach(([k, v]) => {
      if (typeof v === 'boolean' || typeof v === 'string')
        queryBuilder = queryBuilder.andWhere(`role.${k} = :${k}`, {
          [k]: v,
        });
    });

    queryBuilder = queryBuilder.addOrderBy(`role.${sortBy}`, orderBy);

    return queryBuilder;
  }
}
