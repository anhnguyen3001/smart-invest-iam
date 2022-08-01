import { HttpStatus } from '@nestjs/common';
import { ApiCode } from 'src/common/constants/apiCode';
import { APIException } from 'src/common/exceptions';

export class PasswordNotMatchException extends APIException {
  constructor() {
    super(
      ApiCode[400].PASSWORD_NOT_MATCH.code,
      HttpStatus.BAD_REQUEST,
      ApiCode[400].PASSWORD_NOT_MATCH.description,
    );
  }
}

export class SameOldNewPasswordException extends APIException {
  constructor() {
    super(
      ApiCode[400].SAME_OLD_NEW_PASSWORD.code,
      HttpStatus.BAD_REQUEST,
      ApiCode[400].SAME_OLD_NEW_PASSWORD.description,
    );
  }
}

export class InvalidPasswordException extends APIException {
  constructor() {
    super(
      ApiCode[400].INVALID_PASSWORD.code,
      HttpStatus.BAD_REQUEST,
      ApiCode[400].INVALID_PASSWORD.description,
    );
  }
}

export class LackPasswordException extends APIException {
  constructor() {
    super(
      ApiCode[400].REMOVE_USED_ROLE.code,
      HttpStatus.BAD_REQUEST,
      ApiCode[400].REMOVE_USED_ROLE.description,
    );
  }
}
