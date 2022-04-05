import {
  ClassConstructor,
  ClassTransformOptions,
  plainToClass,
} from 'class-transformer';
import { ApiCode } from '../constants';
import { BaseResponse } from '../dtos';

interface IResponse {
  code?: string;
  message?: string;
  data?: unknown;
  details?: unknown;
}

export const getBaseResponse = <T>(
  response: IResponse,
  dataCls: ClassConstructor<T>,
  classTransformOptions?: ClassTransformOptions,
) => {
  const instance = new BaseResponse<T>();
  instance.code = response.code || ApiCode[200].DEFAULT.code;
  instance.message = response.message || ApiCode[200].DEFAULT.description;

  if (response.data) {
    instance.data = plainToClass(dataCls, Object.assign({}, response.data), {
      excludeExtraneousValues: true,
      ...(classTransformOptions || {}),
    });
  }

  return instance;
};
