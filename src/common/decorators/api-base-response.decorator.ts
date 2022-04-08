import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { BaseResponse } from '../dtos';

export const ApiOkBaseResponse = <TModel extends Type<any>>(
  model: TModel,
  responseOptions: ApiResponseOptions = {},
) => {
  return applyDecorators(
    ApiOkResponse({
      ...responseOptions,
      schema: {
        $ref: getSchemaPath(BaseResponse),
        properties: {
          data: {
            $ref: getSchemaPath(model),
          },
        },
      },
    }),
  );
};
