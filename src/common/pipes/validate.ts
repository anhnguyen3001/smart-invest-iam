import { Paramtype, Type, ValidationPipe } from '@nestjs/common';
import { exceptionFactoryValidationPipe } from './exceptions.pipe';

export const transformDtoWithoutGlobalPipe = async (
  value: any,
  metatype: Type<any> | undefined,
  type: Paramtype = 'body',
): Promise<any> => {
  const validationPipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: exceptionFactoryValidationPipe,
    stopAtFirstError: true,
  });
  return await validationPipe.transform(value, {
    metatype,
    type,
  });
};
