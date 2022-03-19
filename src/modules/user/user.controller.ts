import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { getBaseResponse, Identity, IResponse } from 'src/common';
import { CreateUserDto, SearchResultUserDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<IResponse> {
    const user = await this.userService.create(createUserDto);
    return getBaseResponse({ data: { id: user.id } }, Identity);
  }

  @Get()
  async findAll(): Promise<IResponse> {
    const users = await this.userService.findAll();
    return getBaseResponse(
      {
        data: { users },
      },
      SearchResultUserDto,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.userService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
