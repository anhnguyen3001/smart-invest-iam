import {
  Paramtype,
  Type,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { exceptionFactoryValidationPipe } from './utils/exception';

export const DEFAULT_VALIDATION_PIPE: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  exceptionFactory: exceptionFactoryValidationPipe,
  stopAtFirstError: true,
};

export const transformDtoWithoutGlobalPipe = async (
  value: any,
  metatype: Type<any> | undefined,
  type: Paramtype = 'body',
): Promise<any> => {
  const validationPipe = new ValidationPipe(DEFAULT_VALIDATION_PIPE);

  return await validationPipe.transform(value, {
    metatype,
    type,
  });
};
