import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AtGuard } from 'src/auth/guards/at.guard';
import { ApiOkBaseResponse } from 'src/common/decorators/response.decorator';
import { BaseResponse } from 'src/common/types/api-response.type';
import { getBaseResponse } from 'src/common/utils/response';
import { configService } from 'src/config/config.service';
import { UserProfileResponseDto } from './user.dto';

@ApiTags('UserProfile')
@Controller({
  path: 'me',
  version: configService.getValue('API_VERSION'),
})
export class UserProfileController {
  @UseGuards(AtGuard)
  @Get()
  @ApiOperation({
    summary: 'Get user info',
  })
  @ApiOkBaseResponse(UserProfileResponseDto, {
    description: 'Get user info successfully',
  })
  async getUserInfo(
    @Request() request,
  ): Promise<BaseResponse<UserProfileResponseDto>> {
    return getBaseResponse(
      {
        data: { user: request.user },
      },
      UserProfileResponseDto,
    );
  }
}
