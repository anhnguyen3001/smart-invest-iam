import { HttpStatus } from '@nestjs/common';
import { ApiCode, APIException } from 'src/common';

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

export class LackPasswordException extends APIException {
  constructor(message = ApiCode[400].LACK_PASSWORD.description) {
    super(
      ApiCode[400].LACK_PASSWORD.code,
      HttpStatus.BAD_REQUEST,
      message,
      undefined,
    );
  }
}
