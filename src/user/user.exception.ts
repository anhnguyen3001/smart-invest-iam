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

export class OldPasswordWrongException extends APIException {
  constructor() {
    super(
      ApiCode[400].OLD_PASSWORD_INCORRECT.code,
      HttpStatus.BAD_REQUEST,
      ApiCode[400].OLD_PASSWORD_INCORRECT.description,
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
