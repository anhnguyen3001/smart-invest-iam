import { AuthGuard } from '@nestjs/passport';
import { STRATEGY } from 'common/constants/strategy-name';

export class AtGuard extends AuthGuard(STRATEGY.at) {}
