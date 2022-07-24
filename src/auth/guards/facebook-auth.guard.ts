import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGY } from '../constants';

@Injectable()
export class FBAuthGuard extends AuthGuard(STRATEGY.facebook) {}
