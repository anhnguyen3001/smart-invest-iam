import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { BaseResponse } from '../types/api-response.type';

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

export const ApiCreatedBaseResponse = <TModel extends Type<any>>(
  model: TModel,
  responseOptions: ApiResponseOptions = {},
) => {
  return applyDecorators(
    ApiCreatedResponse({
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
