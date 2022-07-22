import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiOkBaseResponse } from 'common/decorators/response.decorator';
import { GetUser, GetUserId } from 'common/decorators/user.decorator';
import { RtGuard } from 'common/guards/rt.guard';
import { BaseResponse } from 'common/types/api-response.type';
import { getBaseResponse } from 'common/utils/response';
import { configService } from 'config/config.service';
import { User } from 'storage/entities/user.entity';
import {
  ForgetPasswordDto,
  LoginDto,
  LoginSocialDto,
  RecoverPasswordDto,
  ResendOtpQueryDto,
  SignupDto,
  TokenResult,
  VerifyOtpQueryDto,
} from './auth.dto';
import { AuthService } from './auth.service';
import { FBAuthGuard, GoogleAuthGuard } from './guards';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: configService.getValue('API_VERSION'),
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Login',
  })
  @ApiOkBaseResponse(TokenResult, {
    description: 'Login successfully',
  })
  async login(@Body() loginDto: LoginDto): Promise<BaseResponse<TokenResult>> {
    const tokens = await this.authService.login(loginDto);
    return getBaseResponse<TokenResult>({ data: tokens }, TokenResult);
  }

  @UseGuards(FBAuthGuard)
  @Get('facebook')
  @ApiOperation({
    summary: 'Login Facebook',
  })
  @ApiOkBaseResponse(TokenResult, {
    description: 'Login facebook successfully',
  })
  async loginFB(
    @Query() _: LoginSocialDto,
    @GetUser() user: User,
  ): Promise<BaseResponse<TokenResult>> {
    const tokens = await this.authService.loginSocial(user);
    return getBaseResponse<TokenResult>({ data: tokens }, TokenResult);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  @ApiOperation({
    summary: 'Login Google',
  })
  @ApiOkBaseResponse(TokenResult, {
    description: 'Login google successfully',
  })
  async loginGoogle(
    @Query() _: LoginSocialDto,
    @GetUser() user: User,
  ): Promise<BaseResponse<TokenResult>> {
    const tokens = await this.authService.loginSocial(user);
    return getBaseResponse<TokenResult>({ data: tokens }, TokenResult);
  }

  @Get('logout')
  async logout(@GetUserId() id: number): Promise<void> {
    await this.authService.logout(id);
  }

  @Post('signup')
  @ApiOperation({
    summary: 'Sign up',
  })
  @ApiCreatedResponse({
    description: 'Sign up successfully',
  })
  async signup(@Body() dto: SignupDto): Promise<void> {
    console.log('signup');
    await this.authService.signup(dto);
  }

  @Get('verify')
  @ApiOperation({
    summary: 'Verify account',
  })
  @ApiOkResponse({
    description: 'Verify account successfully',
  })
  async verifyUser(@Query() query: VerifyOtpQueryDto): Promise<void> {
    await this.authService.verifyUser(query);
  }

  @Get('recover/init')
  @ApiOperation({
    summary: 'Forget password',
  })
  @ApiOkResponse({
    description: 'Forget password successfully',
  })
  async forgetPassword(@Query() query: ForgetPasswordDto): Promise<void> {
    await this.authService.forgetPassword(query);
  }

  @Post('recover/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset password',
  })
  @ApiOkResponse({ description: 'Reset password successfully' })
  async recoverPassword(@Body() dto: RecoverPasswordDto): Promise<void> {
    await this.authService.recoverPassword(dto);
  }

  @Get('resend')
  @ApiOperation({
    summary: 'Resend OTP',
  })
  @ApiOkResponse({ description: 'Resend otp success' })
  async resendOtp(@Query() query: ResendOtpQueryDto): Promise<void> {
    await this.authService.resendOtp(query);
  }

  @UseGuards(RtGuard)
  @Get('refresh-token')
  @ApiOkBaseResponse(TokenResult, {
    description: 'Refresh token successfully',
  })
  async refreshToken(
    @GetUserId() id: number,
    @GetUser('refreshToken') refreshToken: string,
  ): Promise<BaseResponse<TokenResult>> {
    const tokens = await this.authService.refreshToken(id, refreshToken);
    return getBaseResponse({ data: tokens }, TokenResult);
  }
}
