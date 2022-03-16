import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller({
  path: 'app',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }
}
