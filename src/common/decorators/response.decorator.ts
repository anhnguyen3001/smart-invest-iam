import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
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
    ApiExtraModels(BaseResponse, model),
  );
};
