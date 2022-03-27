import {
  ClassConstructor,
  ClassTransformOptions,
  plainToClass,
} from 'class-transformer';

export const getBaseResponse = <T>(
  data: T,
  dataCls: ClassConstructor<unknown>,
  classTransformOptions?: ClassTransformOptions,
): T => {
  const convertedData = plainToClass(dataCls, Object.assign({}, data), {
    excludeExtraneousValues: true,
    ...(classTransformOptions || {}),
  }) as T;

  return convertedData;
};
