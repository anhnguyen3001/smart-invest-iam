import { HttpStatus } from '@nestjs/common';
import { ApiCode, APIException } from 'src/common';

export class UserExistedException extends APIException {
  constructor(message = ApiCode[400].USER_EXISTED.description) {
    super(
      ApiCode[400].USER_EXISTED.code,
      HttpStatus.BAD_REQUEST,
      message,
      undefined,
    );
  }
}

export class PasswordNotMatchException extends APIException {
  constructor(message = ApiCode[400].PASSWORD_NOT_MATCH.description) {
    super(
      ApiCode[400].PASSWORD_NOT_MATCH.code,
      HttpStatus.BAD_REQUEST,
      message,
      undefined,
    );
  }
}

export class OldPasswordWrongException extends APIException {
  constructor(message = ApiCode[400].OLD_PASSWORD_INCORRECT.description) {
    super(
      ApiCode[400].OLD_PASSWORD_INCORRECT.code,
      HttpStatus.BAD_REQUEST,
      message,
      undefined,
    );
  }
}

export class TokenInvalidException extends APIException {
  constructor(message = ApiCode[400].TOKEN_INVALID.description) {
    super(
      ApiCode[400].TOKEN_INVALID.code,
      HttpStatus.BAD_REQUEST,
      message,
      undefined,
    );
  }
}

export class ValidateMailException extends APIException {
  constructor(message = ApiCode[400].TOKEN_INVALID.description) {
    super(
      ApiCode[400].TOKEN_INVALID.code,
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
