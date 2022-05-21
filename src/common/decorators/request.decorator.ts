import { applyDecorators } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';

export const ApiUpsertIdParam = (description: string) => {
  return applyDecorators(
    ApiParam({
      name: 'id',
      type: 'number',
      required: false,
      description,
    }),
  );
};
