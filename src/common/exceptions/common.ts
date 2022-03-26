import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiCode } from 'src/common/constants';

export class APIException extends HttpException {
  code: string | number;
  message: string;
  details: any;

  constructor(
    code: string | number,
    status: HttpStatus,
    message: string,
    details: any,
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
      details: this.details,
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
  constructor(
    message = ApiCode[424].EXTERNAL_API_ERROR.description,
    details?: any,
  ) {
    super(
      ApiCode[424].EXTERNAL_API_ERROR.code,
      HttpStatus.FAILED_DEPENDENCY,
      message,
      details,
    );
  }
}

export class MissingFieldHeaderException extends APIException {
  constructor(message = ApiCode[400].MISSING_FIELD_HEADER.description) {
    super(
      ApiCode[400].MISSING_FIELD_HEADER.code,
      HttpStatus.BAD_REQUEST,
      message,
      undefined,
    );
  }
}
