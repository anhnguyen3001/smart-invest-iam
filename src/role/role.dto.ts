import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BASE_SORT_BY, QueryCoreDto, ResponseWithPagination } from 'common/dto';
import { Role } from 'storage/entities/role.entity';

const ROLE_SORT_BY = BASE_SORT_BY;
export class SearchRoleDto extends QueryCoreDto {
  @ApiProperty({ enum: ROLE_SORT_BY, default: 'id', required: false })
  @IsIn(ROLE_SORT_BY)
  @IsOptional()
  sortBy?: string = 'id';
}

export class SearchRolesResponse extends ResponseWithPagination {
  @Expose()
  @ApiResponseProperty({ type: [Role] })
  @Type(() => Role)
  roles: Role[];
}

export class CreateRoleDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  code: string;
}

export class UpdateRoleDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  name?: string;

  @IsNumber({}, { each: true })
  @IsArray()
  @IsOptional()
  permissionIds?: number[];
}
