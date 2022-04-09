import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGY } from 'common/constants/strategy-name';

@Injectable()
export class GoogleAuthGuard extends AuthGuard(STRATEGY.google) {}
