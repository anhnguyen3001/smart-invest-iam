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
import {
  ApiOkBaseResponse,
  BaseResponse,
  getBaseResponse,
  GetUser,
  GetUserId,
  Identity,
  Public,
  RtGuard,
} from 'src/common';
import { User } from 'src/entities';
import { AuthService } from './auth.service';
import {
  ForgetPasswordDto,
  LoginDto,
  LoginSocialDto,
  ResendMailQueryDto,
  ResetPasswordDto,
  ResetPasswordQuery,
  SignupDto,
  Tokens,
  VerifyUserQueryDto,
} from './dtos';
import { FBAuthGuard, GoogleAuthGuard } from './guards';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
@ApiExtraModels(BaseResponse, Tokens, Identity)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Login',
  })
  @ApiOkBaseResponse(Tokens, {
    status: 200,
    description: 'Login successfully',
  })
  async login(@Body() loginDto: LoginDto): Promise<BaseResponse<Tokens>> {
    const tokens = await this.authService.login(loginDto);

    return getBaseResponse<Tokens>({ data: tokens }, Tokens);
  }

  @Public()
  @UseGuards(FBAuthGuard)
  @Get('facebook')
  @ApiQuery({ type: LoginSocialDto })
  @ApiOkBaseResponse(Tokens, {
    description: 'Login facebook successfully',
  })
  async loginFB(@GetUser() user: User): Promise<Tokens> {
    return this.authService.loginSocial(user);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  @ApiQuery({ type: LoginSocialDto })
  @ApiOkBaseResponse(Tokens, {
    description: 'Login google successfully',
  })
  async loginGoogle(@GetUser() user: User): Promise<Tokens> {
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
  @ApiOkBaseResponse(Tokens, {
    description: 'Refresh token successfully',
  })
  async refreshToken(
    @GetUserId() id: number,
    @GetUser('refreshToken') refreshToken: string,
  ): Promise<BaseResponse<Tokens>> {
    const tokens = await this.authService.refreshToken(id, refreshToken);
    return getBaseResponse({ data: tokens }, Tokens);
  }
}
