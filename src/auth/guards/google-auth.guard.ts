import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGY } from '../constants';

@Injectable()
export class GoogleAuthGuard extends AuthGuard(STRATEGY.google) {}
