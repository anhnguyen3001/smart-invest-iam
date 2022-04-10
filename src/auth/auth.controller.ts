import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ApiOkBaseResponse } from 'common/decorators/api-base-response.decorator';
import { GetUserId } from 'common/decorators/get-user-id.decorator';
import { GetUser } from 'common/decorators/get-user.decorator';
import { Public } from 'common/decorators/public.decorator';
import { BaseResponse, Identity } from 'common/types/api-response.type';
import { RtGuard } from 'common/guards/rt.guard';
import { getBaseResponse } from 'common/utils';
import { User } from 'storage/entities/user.entity';
import { AuthService } from './auth.service';
import {
  ForgetPasswordDto,
  LoginDto,
  LoginSocialDto,
  ResendMailQueryDto,
  ResetPasswordDto,
  ResetPasswordQuery,
  SignupDto,
  TokenDto,
  VerifyUserQueryDto,
} from './dtos';
import { FBAuthGuard, GoogleAuthGuard } from './guards';
import { configService } from 'config/config.service';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: configService.getValue('API_VERSION'),
})
@ApiExtraModels(BaseResponse, TokenDto, Identity)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Login',
  })
  @ApiOkBaseResponse(TokenDto, {
    status: 200,
    description: 'Login successfully',
  })
  async login(@Body() loginDto: LoginDto): Promise<BaseResponse<TokenDto>> {
    const tokens = await this.authService.login(loginDto);
    return getBaseResponse<TokenDto>({ data: tokens }, TokenDto);
  }

  @Public()
  @UseGuards(FBAuthGuard)
  @Get('facebook')
  @ApiQuery({ type: LoginSocialDto })
  @ApiOkBaseResponse(TokenDto, {
    description: 'Login facebook successfully',
  })
  async loginFB(@GetUser() user: User): Promise<TokenDto> {
    return this.authService.loginSocial(user);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  @ApiQuery({ type: LoginSocialDto })
  @ApiOkBaseResponse(TokenDto, {
    description: 'Login google successfully',
  })
  async loginGoogle(@GetUser() user: User): Promise<TokenDto> {
    return this.authService.loginSocial(user);
  }

  @Get('logout')
  async logout(@GetUserId() id: number): Promise<void> {
    await this.authService.logout(id);
  }

  @Public()
  @Post('signup')
  @ApiOperation({
    summary: 'Sign up',
  })
  @ApiOkBaseResponse(Identity, {
    description: 'Sign up successfully',
  })
  @ApiOkResponse({ description: 'Sign up successfully' })
  async signup(@Body() dto: SignupDto): Promise<BaseResponse<Identity>> {
    const user = await this.authService.signup(dto);
    return getBaseResponse({ data: { id: user.id } }, Identity);
  }

  @Public()
  @Get('verify')
  @ApiOperation({
    summary: 'Verify account',
  })
  async verifyUser(@Query() query: VerifyUserQueryDto): Promise<void> {
    await this.authService.verifyUser(query);
  }

  @Public()
  @Post('forget-password')
  @ApiOperation({
    summary: 'Forget password',
  })
  @ApiOkBaseResponse(Identity, { description: 'Forget password successfully' })
  async forgetPassword(
    @Body() dto: ForgetPasswordDto,
  ): Promise<BaseResponse<Identity>> {
    const user = await this.authService.forgetPassword(dto);
    return getBaseResponse({ data: { id: user.id } }, Identity);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset password',
  })
  @ApiOkResponse({ description: 'Reset password successfully' })
  async resetPassword(
    @Query() query: ResetPasswordQuery,
    @Body() dto: ResetPasswordDto,
  ): Promise<void> {
    await this.authService.resetPassword(query, dto);
  }

  @Public()
  @Get('resend-mail')
  @ApiOperation({
    summary: 'Resend email',
  })
  async resendMail(@Query() query: ResendMailQueryDto): Promise<void> {
    await this.authService.resendMail(query);
  }

  @UseGuards(RtGuard)
  @Get('refresh-token')
  @ApiOkBaseResponse(TokenDto, {
    description: 'Refresh token successfully',
  })
  async refreshToken(
    @GetUserId() id: number,
    @GetUser('refreshToken') refreshToken: string,
  ): Promise<BaseResponse<TokenDto>> {
    const tokens = await this.authService.refreshToken(id, refreshToken);
    return getBaseResponse({ data: tokens }, TokenDto);
  }
}
