import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGY } from 'common/constants/strategy-name';
import { Request } from 'express';
import { RouteService } from 'route/route.service';

@Injectable()
export class AppGuard extends AuthGuard(STRATEGY.at) {
  constructor(
    @Inject(RouteService) private routeService: RouteService,
    private reflector: Reflector,
  ) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    const request: Request = context.switchToHttp().getRequest();

    if (isPublic) return true;

    const isAuthen = await super.canActivate(context);
    if (!isAuthen) {
      return false;
    }

    // Check if route requires permission
    await this.routeService.checkRoutePermission(
      (request.user as any)?.id,
      request.path,
      request.method,
    );
    return true;
  }
}
