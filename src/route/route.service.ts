import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityEnum } from 'src/common/constants/apiCode';
import { ExistedException } from 'src/common/exceptions';
import { QueryBuilderType } from 'src/common/types/core.type';
import { paginate } from 'src/common/utils/core';
import { PermissionService } from 'src/permission/permission.service';
import { Route } from 'src/storage/entities/route.entity';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import {
  CreateRouteDto,
  RouteAccessQueryDto,
  SearchRouteDto,
  SearchRoutesResponse,
  UpdateRouteDto,
} from './route.dto';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route) private routeRepo: Repository<Route>,
    private readonly permissionService: PermissionService,
  ) {}

  async getListRoutes(dto: SearchRouteDto): Promise<SearchRoutesResponse> {
    const { page = 1, pageSize = 10, getAll, ...rest } = dto;

    if (getAll) {
      const data = await this.getQueryBuilder(rest).getMany();
      return {
        routes: data,
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
      routes: items,
      pagination: {
        totalItems: meta.totalItems,
        totalPages: meta.totalPages,
      },
    };
  }

  async createRoute(data: CreateRouteDto): Promise<Route> {
    const route = await this.routeRepo.findOne({
      regUri: data.regUri,
      method: data.method,
    });
    if (route) {
      throw new ExistedException(EntityEnum.route);
    }

    const permission = await this.permissionService.findOneAndThrowNotFound(
      { id: data.permissionId },
      true,
    );
    delete data.permissionId;

    return this.routeRepo.save(this.routeRepo.create({ ...data, permission }));
  }

  async updateRoute(id: number, data: UpdateRouteDto): Promise<Route> {
    const route = await this.findOneAndThrowNotFound({ id }, true);

    const { permissionId } = data;
    if (permissionId) {
      const permission = await this.permissionService.findOneAndThrowNotFound(
        { id },
        true,
      );

      route.permission = permission;
      delete data.permissionId;
    }

    this.routeRepo.merge(route, data);
    return this.routeRepo.save(route);
  }

  async deleteRoute(id: number): Promise<void> {
    const route = await this.findOneAndThrowNotFound({ id }, true);

    await this.routeRepo.softRemove(route);
  }

  async validateRoutePermission(query: RouteAccessQueryDto): Promise<boolean> {
    const { path, method, userId } = query;

    const queryBuilder = this.routeRepo
      .createQueryBuilder('route')
      .where(`:path RLIKE route.reg_uri`, { path })
      .andWhere(`route.method = :method`, { method });

    const restrictedRoute = await queryBuilder.getOne();
    if (restrictedRoute) {
      const route = await queryBuilder
        .innerJoinAndSelect('route.permission', 'permission')
        .innerJoin('role_permission', 'rp', 'rp.permission_id =  permission.id')
        .innerJoin('roles', 'role', 'role.id =  rp.role_id')
        .innerJoin(
          'user_role',
          'ur',
          'ur.role_id = role.id AND ur.user_id = :userId',
          { userId },
        )
        .getOne();

      if (!route) {
        return false;
      }
    }

    return true;
  }

  async findOneAndThrowNotFound(
    condition: Partial<Route>,
    throwNotFound?: boolean,
  ): Promise<Route> {
    const route = await this.routeRepo.findOne(condition);
    if (throwNotFound && !route) {
      throw new NotFoundException(EntityEnum.route);
    }
    return route;
  }

  getQueryBuilder(
    dto: QueryBuilderType<SearchRouteDto>,
  ): SelectQueryBuilder<Route> {
    const { q, orderBy, sortBy, permissionIds, path, ...rest } = dto;
    let queryBuilder = this.routeRepo
      .createQueryBuilder('route')
      .leftJoinAndSelect('route.permission', 'permission');

    // search option
    if (q) {
      queryBuilder = queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('route.id = :id', { id: q }).orWhere('route.name LIKE :q', {
            q: `%${q}%`,
          });
        }),
      );
    }

    if (path) {
      queryBuilder = queryBuilder.andWhere(`:path RLIKE route.reg_uri`, {
        path,
      });
    }

    if (permissionIds?.length) {
      queryBuilder = queryBuilder.andWhere(
        `permission.id IN (:...permissionIds)`,
        { permissionIds },
      );
    }

    // boolean option + string option
    Object.entries(rest).forEach(([k, v]) => {
      if (typeof v === 'boolean' || typeof v === 'string')
        queryBuilder = queryBuilder.andWhere(`route.${k} = :${k}`, {
          [k]: v,
        });
    });

    queryBuilder = queryBuilder.addOrderBy(`route.${sortBy}`, orderBy);

    return queryBuilder;
  }
}
