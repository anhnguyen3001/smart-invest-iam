import {
  Paramtype,
  Type,
  ValidationError,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ValidateErrorCode } from './constants/errorCode';
import { ValidationException } from './exceptions';

export const exceptionFactoryValidationPipe = (
  validationErrors: ValidationError[],
): ValidationException => {
  const errorCodes = validationErrors.reduce((acc, curr) => {
    if (Object.keys(curr.constraints).includes('whitelistValidation')) {
      return {
        ...acc,
        [curr.property]: [ValidateErrorCode.UNKNOWN_FIELD],
      };
    }
    return {
      ...acc,
      [curr.property]: Object.values(curr.constraints),
    };
  }, {});
  return new ValidationException(null, null, errorCodes);
};

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
