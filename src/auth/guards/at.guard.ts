import { AuthGuard } from '@nestjs/passport';
import { STRATEGY } from '../constants';

export class AtGuard extends AuthGuard(STRATEGY.at) {}
