import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGY } from 'src/common';

@Injectable()
export class GoogleAuthGuard extends AuthGuard(STRATEGY.google) {}
