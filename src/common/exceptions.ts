import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiCode, EntityEnum } from './constants/apiCode';
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Response } from 'express';

export class APIException extends HttpException {
  code: string | number;
  message: string;
  details: any;

  constructor(
    code: string | number,
    status: HttpStatus,
    message: string,
    details?,
  ) {
    const exceptionResponse = {
      code,
      message,
      details,
    };
    super(exceptionResponse, status);
    this.code = code;
    this.message = message;
    this.details = details;
  }

  toObj(): object {
    return {
      code: this.code,
      message: this.message,
    };
  }

  toJSON(): string {
    return JSON.stringify(this.toObj());
  }
}

export class ValidationException extends APIException {
  constructor(code?: string | number, message?: string, details?: any) {
    if (!code) code = ApiCode[400].VALIDATION_ERROR.code;
    if (!message) message = ApiCode[400].VALIDATION_ERROR.description;
    super(code, HttpStatus.BAD_REQUEST, message, details);
  }
}

export class ExternalAPIException extends APIException {
  constructor(message = ApiCode[424].EXTERNAL_API_ERROR.description) {
    super(
      ApiCode[424].EXTERNAL_API_ERROR.code,
      HttpStatus.FAILED_DEPENDENCY,
      message,
    );
  }
}

export class MissingFieldHeaderException extends APIException {
  constructor(message = ApiCode[400].MISSING_FIELD_HEADER.description) {
    super(
      ApiCode[400].MISSING_FIELD_HEADER.code,
      HttpStatus.BAD_REQUEST,
      message,
    );
  }
}

export class NotFoundException extends APIException {
  constructor(field: EntityEnum) {
    super(
      ApiCode[404].NOT_FOUND.code,
      HttpStatus.NOT_FOUND,
      `${field} ${ApiCode[404].NOT_FOUND.description}`,
    );
  }
}

export class ExistedException extends APIException {
  constructor(field: EntityEnum) {
    super(
      ApiCode[400].EXISTED_ENTITY.code,
      HttpStatus.BAD_REQUEST,
      `${field} ${ApiCode[400].EXISTED_ENTITY.description}`,
    );
  }
}

const nestLogger = new Logger('HandleError');

// Error handler
@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
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
        ).toObj(),
      );
  }
}
