import { HttpStatus } from '@nestjs/common';
import { ApiCode, APIException } from 'src/common';

export class UnAuthorizedException extends APIException {
  constructor(message = ApiCode[401].UNAUTHORIZED.description) {
    super(
      ApiCode[401].UNAUTHORIZED.code,
      HttpStatus.UNAUTHORIZED,
      message,
      undefined,
    );
  }
}

export class AccessDeniedException extends APIException {
  constructor(message = ApiCode[403].ACCESS_DENIED.description) {
    super(
      ApiCode[403].ACCESS_DENIED.code,
      HttpStatus.FORBIDDEN,
      message,
      undefined,
    );
  }
}

export class InvalidTokenException extends APIException {
  constructor(message = ApiCode[400].INVALID_TOKEN.description) {
    super(
      ApiCode[400].INVALID_TOKEN.code,
      HttpStatus.BAD_REQUEST,
      message,
      undefined,
    );
  }
}

export class EmailValidatedException extends APIException {
  constructor(message = ApiCode[400].EMAIL_VALIDATED.description) {
    super(
      ApiCode[400].EMAIL_VALIDATED.code,
      HttpStatus.BAD_REQUEST,
      message,
      undefined,
    );
  }
}
