import {
  ClassConstructor,
  ClassTransformOptions,
  plainToClass,
} from 'class-transformer';
import { ApiCode } from '../constants/apiCode';
import { BaseResponse } from '../types/api-response.type';

export const getBaseResponse = <T>(
  response: Partial<BaseResponse<T>>,
  dataCls: ClassConstructor<T>,
  classTransformOptions?: ClassTransformOptions,
) => {
  const instance = new BaseResponse<T>();
  instance.code = response.code || ApiCode[200].DEFAULT.code;
  instance.message = response.message || ApiCode[200].DEFAULT.description;
  instance.details = response.details;

  if (response.data) {
    instance.data = plainToClass(dataCls, Object.assign({}, response.data), {
      excludeExtraneousValues: true,
      ...classTransformOptions,
    });
  }

  return instance;
};
