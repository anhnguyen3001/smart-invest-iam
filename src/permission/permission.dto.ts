import {
  ApiProperty,
  ApiResponseProperty,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BASE_SORT_BY, QueryCoreDto, ResponseWithPagination } from 'common/dto';
import { Permission } from 'storage/entities/permission.entity';

export class NestedPermissionDto extends PickType(Permission, [
  'id',
  'name',
  'code',
]) {}

const PERMISSION_SORT_BY = BASE_SORT_BY;
export class SearchPermissionDto extends QueryCoreDto {
  @ApiProperty({ enum: PERMISSION_SORT_BY, default: 'id', required: false })
  @IsIn(PERMISSION_SORT_BY)
  @IsOptional()
  sortBy?: string = 'id';
}

export class SearchPermissionsResponse extends ResponseWithPagination {
  @Expose()
  @ApiResponseProperty({ type: [Permission] })
  @Type(() => Permission)
  permissions: Permission[];
}

export class CreatePermissionDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  code: string;
}

export class UpdatePermissionDto extends PartialType(
  PickType(CreatePermissionDto, ['name']),
) {}
