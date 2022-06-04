import {
  ApiProperty,
  ApiResponseProperty,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { PATTERN_VALIDATION } from 'common/constants/validation';
import { BASE_SORT_BY, QueryCoreDto, ResponseWithPagination } from 'common/dto';
import { LoginMethodEnum, User } from 'storage/entities/user.entity';
import { PasswordNotMatchException } from './user.exception';

export class UpdatePasswordDto {
  @ApiProperty({ type: 'string' })
  @Matches(PATTERN_VALIDATION.password)
  newPassword: string;

  @ApiProperty({ type: 'string' })
  @Matches(PATTERN_VALIDATION.password)
  confirmPassword: string;

  validate() {
    if (this.newPassword !== this.confirmPassword) {
      throw new PasswordNotMatchException();
    }
  }
}

export class ChangePasswordDto extends UpdatePasswordDto {
  @ApiProperty({ type: 'string' })
  @Matches(PATTERN_VALIDATION.password)
  oldPassword: string;
}

export class UpdateProfileDto {
  @ApiProperty({ type: 'string' })
  @MaxLength(255)
  @MinLength(1)
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ type: 'string' })
  @MaxLength(255)
  @MinLength(1)
  @IsString()
  @IsOptional()
  avatar?: string;
}

export class UserResponseDto {
  @Expose()
  @ApiResponseProperty({ type: User })
  @Type(() => User)
  user: User;
}

const USER_SORT_BY = BASE_SORT_BY;
export class SearchUserDto extends QueryCoreDto {
  @ApiProperty({ enum: USER_SORT_BY, default: 'id', required: false })
  @IsIn(USER_SORT_BY)
  @IsOptional()
  sortBy?: string = 'id';

  @ApiProperty({ enum: LoginMethodEnum, required: false })
  @IsIn(Object.values(LoginMethodEnum))
  @IsOptional()
  method?: string;

  @ApiProperty({ type: [Number], required: false })
  @IsNumber({}, { each: true })
  @IsArray()
  @IsOptional()
  userIds?: number[];
}

export class SearchUsersResponse extends ResponseWithPagination {
  @Expose()
  @ApiResponseProperty({ type: [User] })
  @Type(() => User)
  users: User[];
}

export class CreateUserDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @Matches(PATTERN_VALIDATION.email)
  email: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @Max(255)
  @Min(1)
  username: string;

  @ApiProperty({ type: 'boolean', required: false })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @Matches(PATTERN_VALIDATION.password)
  password?: string;

  @ApiProperty({ enum: LoginMethodEnum, required: false })
  @IsEnum(LoginMethodEnum)
  @IsOptional()
  method?: LoginMethodEnum;
}

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['username', 'password']),
) {
  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ type: 'number', required: false })
  @IsNumber()
  @IsOptional()
  roleId?: number;
}
