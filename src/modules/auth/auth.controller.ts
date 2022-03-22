import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  getBaseResponse,
  GetUser,
  GetUserId,
  IResponse,
  Public,
  RtGuard,
} from 'src/common';
import { AuthService } from './auth.service';
import {
  ForgetPasswordDto,
  LoginDto,
  ResetPasswordDto,
  SignupDto,
  TokenDto,
  VerifyUserQueryDto,
} from './dtos';

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
  async signup(@Body() dto: SignupDto): Promise<void> {
    await this.authService.signup(dto);
  }

  @Public()
  @Get('verify')
  @ApiOperation({
    summary: 'Validate user email',
  })
  async verifyUser(@Query() query: VerifyUserQueryDto): Promise<void> {
    await this.authService.verifyUser(query);
  }

  @Public()
  @Post('forget-password')
  async forgetPassword(@Body() dto: ForgetPasswordDto): Promise<void> {
    await this.authService.forgetPassword(dto);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.authService.resetPassword(dto);
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
