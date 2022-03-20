import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  getBaseResponse,
  GetUser,
  GetUserId,
  Identity,
  IResponse,
  Public,
  RtGuard,
} from 'src/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto, TokenDto } from './dtos';
import { LocalAuthGuard } from './guards';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Login successfully' })
  async login(@Body() loginDto: LoginDto): Promise<IResponse> {
    const tokens = await this.authService.login(loginDto);

    return getBaseResponse({ data: tokens }, TokenDto);
  }

  @Get('/logout')
  async logout(@GetUserId() id: number): Promise<void> {
    await this.authService.logout(id);
  }

  @Public()
  @Post('/signup')
  async signup(@Body() dto: SignupDto): Promise<IResponse> {
    const user = await this.authService.signup(dto);

    return getBaseResponse({ data: { id: user.id } }, Identity);
  }

  @UseGuards(RtGuard)
  @Get('/refresh-token')
  async refreshToken(
    @GetUserId() id: number,
    @GetUser('refreshToken') refreshToken: string,
  ): Promise<IResponse> {
    const tokens = await this.authService.refreshToken(id, refreshToken);

    return getBaseResponse({ data: tokens }, TokenDto);
  }
}
