import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'common/decorators/public.decorator';
import { ApiOkBaseResponse } from 'common/decorators/response.decorator';
import { GetUser, GetUserId } from 'common/decorators/user.decorator';
import { RtGuard } from 'common/guards/rt.guard';
import { BaseResponse } from 'common/types/api-response.type';
import { getBaseResponse } from 'common/utils/response';
import { configService } from 'config/config.service';
import { Request } from 'express';
import { User } from 'storage/entities/user.entity';
import { UpdatePasswordDto } from 'user/user.dto';
import {
  ForgetPasswordDto,
  LoginDto,
  LoginSocialDto,
  OtpTokenResult,
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

  @Public()
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

  @Public()
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

  @Public()
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

  @Public()
  @Post('signup')
  @ApiOperation({
    summary: 'Sign up',
  })
  @ApiCreatedResponse({
    description: 'Sign up successfully',
  })
  async signup(@Body() dto: SignupDto): Promise<void> {
    await this.authService.signup(dto);
  }

  @Public()
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

  @Public()
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

  @Public()
  @Get('recover/code')
  @ApiOperation({
    summary: 'Verify otp for reset password',
  })
  @ApiOkBaseResponse(OtpTokenResult, {
    description: 'Verify OTP successfully',
  })
  async recoverCode(
    @Query() query: VerifyOtpQueryDto,
  ): Promise<BaseResponse<OtpTokenResult>> {
    const token = await this.authService.verifyOtpResetPassword(query);
    return getBaseResponse({ data: { token } }, OtpTokenResult);
  }

  @Public()
  @Post('recover/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset password',
  })
  @ApiOkResponse({ description: 'Reset password successfully' })
  async recoverPassword(
    @Req() req: Request,
    @Body() dto: UpdatePasswordDto,
  ): Promise<void> {
    const token = req.headers.authorization;
    await this.authService.recoverPassword(dto, token);
  }

  @Public()
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
