import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';

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

export function ToArray(
  type: 'string' | 'number' = 'string',
  separator = ',',
): (target: any, key: string) => void {
  return Transform(
    (params) => {
      const value = params.value;
      if (!!value && typeof value === 'string') {
        const values = value.split(separator);
        switch (type) {
          case 'number':
            return values.map((el) => parseFloat(el));
          default:
            return values;
        }
      }
      return value;
    },
    { toClassOnly: true },
  );
}
