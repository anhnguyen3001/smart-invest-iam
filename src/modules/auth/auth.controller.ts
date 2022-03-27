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
import { GetUser, GetUserId, Public, RtGuard } from 'src/common';
import { User } from 'src/entities';
import { AuthService } from './auth.service';
import {
  ForgetPasswordDto,
  LoginDto,
  ResendMailQueryDto,
  ResetPasswordDto,
  SignupDto,
  Tokens,
  VerifyUserQueryDto,
} from './dtos';
import { FBAuthGuard } from './guards';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Login',
  })
  @ApiOkResponse({
    status: 200,
    type: Tokens,
    description: 'Login successfully',
  })
  async login(@Body() loginDto: LoginDto): Promise<Tokens> {
    return this.authService.login(loginDto);
  }

  @Public()
  @UseGuards(FBAuthGuard)
  @Get('facebook')
  async loginFB(): Promise<void> {
    console.log('abc');
  }

  @Public()
  @UseGuards(FBAuthGuard)
  @Get('facebook/redirect')
  async redirectFB(@GetUser() user: User): Promise<Tokens> {
    return this.authService.loginFB(user);
  }

  @Get('logout')
  async logout(@GetUserId() id: number): Promise<void> {
    console.log('id ', id);
    await this.authService.logout(id);
  }

  @Public()
  @Post('signup')
  @ApiOperation({
    summary: 'Sign up',
  })
  @ApiOkResponse({ description: 'Sign up successfully' })
  async signup(@Body() dto: SignupDto): Promise<void> {
    await this.authService.signup(dto);
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
  @ApiOkResponse({ description: 'Forget password successfully' })
  async forgetPassword(@Body() dto: ForgetPasswordDto): Promise<void> {
    await this.authService.forgetPassword(dto);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset password',
  })
  @ApiOkResponse({ description: 'Reset password successfully' })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.authService.resetPassword(dto);
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
  async refreshToken(
    @GetUserId() id: number,
    @GetUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshToken(id, refreshToken);
  }
}
