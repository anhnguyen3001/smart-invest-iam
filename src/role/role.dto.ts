import {
  ApiProperty,
  ApiResponseProperty,
  PartialType,
  PickType,
} from '@nestjs/swagger';
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
import {
  BASE_SORT_BY,
  QueryCoreDto,
  ResponseWithPagination,
} from 'src/common/dto';
import { Role } from 'src/storage/entities/role.entity';

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

  @ApiProperty({ type: [Number], required: false })
  @IsNumber({}, { each: true })
  @IsArray()
  @IsOptional()
  permissionIds?: number[];
}

export class UpdateRoleDto extends PartialType(
  PickType(CreateRoleDto, ['name', 'permissionIds']),
) {}
