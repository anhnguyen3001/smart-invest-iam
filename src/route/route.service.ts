import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessDeniedException } from 'auth/auth.exception';
import { EntityEnum } from 'common/constants/apiCode';
import { ExistedException } from 'common/exceptions';
import { paginate } from 'common/utils/core';
import { PermissionService } from 'permission/permission.service';
import { SearchRoleDto } from 'role/role.dto';
import { Route } from 'storage/entities/route.entity';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import {
  CreateRouteDto,
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
    const { page = 1, pageSize = 10 } = dto;

    const { items, meta } = await paginate(this.getQueryBuilder(dto), {
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
      route: data.route,
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

  async checkRoutePermission(
    userId: number,
    path: string,
    method: string,
  ): Promise<boolean> {
    const restrictedRoute = await this.routeRepo.findOne({
      where: { route: path, method },
    });
    if (!restrictedRoute) {
      return true;
    }

    const route = await this.routeRepo
      .createQueryBuilder('route')
      .innerJoinAndSelect('route.permission', 'permission')
      .innerJoin('role_permission', 'rp', 'rp.permission_id =  permission.id')
      .innerJoin('roles', 'role', 'role.id =  rp.role_id')
      .innerJoin(
        'user_role',
        'ur',
        'ur.role_id = role.id AND ur.user_id = :userId',
        { userId },
      )
      .where('route.route = :path', { path })
      .andWhere('route.method = :method', { method })
      .getOne();

    if (!route) {
      throw new AccessDeniedException();
    }
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

  getQueryBuilder(dto: SearchRoleDto): SelectQueryBuilder<Route> {
    const { page, pageSize, q, orderBy, sortBy, ...rest } = dto;
    let queryBuilder = this.routeRepo.createQueryBuilder('route');

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
