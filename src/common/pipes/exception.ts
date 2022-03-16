import { ValidationError } from '@nestjs/common';
import { ValidateErrorCode } from 'src/common/constants';
import { ValidationException } from '../exceptions';

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
