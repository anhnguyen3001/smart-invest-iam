import {
  ClassConstructor,
  ClassTransformOptions,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { ApiCode } from '../constants';
import { BaseResponse } from '../dtos';

export interface IResponse {
  code?: string;
  message?: string;
  data?: unknown;
}

export const getBaseResponse = (
  response: IResponse,
  dataCls: ClassConstructor<unknown>,
  classTransformOptions?: ClassTransformOptions,
): IResponse => {
  const instance = new BaseResponse<unknown>();

  instance.code = response.code || ApiCode[200].DEFAULT.code;
  instance.message = response.message || ApiCode[200].DEFAULT.description;

  if (response.data)
    instance.data = plainToInstance(
      dataCls,
      Object.assign({}, response.data),
      classTransformOptions,
    );

  return instanceToPlain(instance);
};
