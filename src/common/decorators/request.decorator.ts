import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';

export const ApiUpsert = (CreateDto: Type, UpdateDto: Type) => {
  const createSchemaPath = getSchemaPath(CreateDto);
  const updateSchemaPath = getSchemaPath(UpdateDto);

  return applyDecorators(
    ApiQuery({
      name: 'id',
      type: 'number',
      required: false,
    }),
    ApiBody({
      schema: {
        oneOf: [{ $ref: createSchemaPath }, { $ref: updateSchemaPath }],
      },
      examples: {
        'Create Dto': {
          $ref: createSchemaPath,
        },
        'Update Dto': {
          $ref: updateSchemaPath,
        },
      },
    }),
    ApiExtraModels(CreateDto, UpdateDto),
  );
};
