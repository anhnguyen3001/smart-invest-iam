import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const ApiUpsertQuery = () => {
  return applyDecorators(
    ApiQuery({
      name: 'id',
      type: 'number',
      required: false,
    }),
  );
};
