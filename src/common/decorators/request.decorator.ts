import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBody,
  ApiQuery,
  IntersectionType,
  PartialType,
} from '@nestjs/swagger';

export const ApiUpsertQuery = () => {
  return applyDecorators(
    ApiQuery({
      name: 'id',
      type: 'number',
      required: false,
    }),
  );
};

export const ApiUpsertBody = (CreateDto: Type, UpdateDto: Type) => {
  return applyDecorators(
    ApiBody({
      type: PartialType(IntersectionType(CreateDto, UpdateDto)),
    }),
  );
};
