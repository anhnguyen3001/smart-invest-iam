import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessDeniedException } from 'auth/auth.exception';
import { Route } from 'storage/entities/route.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RouteService {
  constructor(@InjectRepository(Route) private routeRepo: Repository<Route>) {}

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
}
