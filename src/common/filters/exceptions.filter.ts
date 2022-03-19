import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiCode } from 'src/common/constants';
import { APIException } from '../exceptions';

const nestLogger = new Logger('HandleError');

// Error handler
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): Response<unknown> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof APIException) {
      nestLogger.warn(exception.toJSON());
      return response.status(exception.getStatus()).json(exception.toObj());
    }

    if (exception instanceof HttpException) {
      nestLogger.error(
        (exception as any)?.stack || (exception as any)?.message,
      );
      return response
        .status(exception.getStatus())
        .json(
          new APIException(
            ApiCode[500].UNHANDLED_ERROR.code,
            exception.getStatus(),
            (exception.getResponse() as any)?.message ||
              ApiCode[500].UNHANDLED_ERROR.description,
            undefined,
          ).toObj(),
        );
    }

    nestLogger.error((exception as any)?.stack || (exception as any)?.message);
    return response
      .status(500)
      .json(
        new APIException(
          ApiCode[500].UNKNOWN_ERROR.code,
          500,
          ApiCode[500].UNKNOWN_ERROR.description,
          JSON.stringify(exception),
        ).toObj(),
      );
  }
}
