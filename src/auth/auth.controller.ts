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
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ApiOkBaseResponse } from 'common/decorators/api-base-response.decorator';
import { GetUser, GetUserId } from 'common/decorators/get-user.decorator';
import { Public } from 'common/decorators/public.decorator';
import { RtGuard } from 'common/guards/rt.guard';
import { BaseResponse, Identity } from 'common/types/api-response.type';
import { getBaseResponse } from 'common/utils/response';
import { configService } from 'config/config.service';
import { User } from 'storage/entities/user.entity';
import { UpdatePasswordDto } from 'user/dto/change-password.dto';
import { AuthService } from './auth.service';
import {
  ForgetPasswordDto,
  LoginDto,
  LoginSocialDto,
  ResendOtpQueryDto,
  SignupDto,
  TokenDto,
  VerifyOtpQueryDto,
} from './dtos';
import { FBAuthGuard, GoogleAuthGuard } from './guards';

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
  async verifyUser(@Query() query: VerifyOtpQueryDto): Promise<void> {
    await this.authService.verifyUser(query);
  }

  @Public()
  @Get('recover/init')
  @HttpCode(HttpStatus.NO_CONTENT)
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
  async recoverCode(@Query() query: VerifyOtpQueryDto): Promise<void> {
    await this.authService.verifyOtpResetPassword(query);
  }

  @Public()
  @Post('recover/password')
  @ApiOperation({
    summary: 'Reset password',
  })
  @ApiOkResponse({ description: 'Reset password successfully' })
  async recoverPassword(
    @Query() query: VerifyOtpQueryDto,
    @Body() dto: UpdatePasswordDto,
  ): Promise<void> {
    await this.authService.recoverPassword(query, dto);
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
