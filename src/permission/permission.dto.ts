import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { QueryCoreDto, ResponseWithPagination } from 'common/dto';
import { Permission } from 'storage/entities/permission.entity';

const PERMISSION_SORT_BY = ['id', 'createdAt', 'updatedAt'];
export class SearchPermissionDto extends QueryCoreDto {
  @ApiProperty({ enum: PERMISSION_SORT_BY, default: 'id', required: false })
  @IsIn(PERMISSION_SORT_BY)
  @IsOptional()
  sortBy?: string = 'id';
}

export class SearchPermissionsResult extends ResponseWithPagination {
  @Expose()
  @ApiResponseProperty({ type: [Permission] })
  @Type(() => Permission)
  permissions: Permission[];
}

export class UpsertPermissionQueryDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  permissionId?: number;
}

export class CreatePermissionDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  code: string;
}

export class UpdatePermissionDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  name?: string;
}
