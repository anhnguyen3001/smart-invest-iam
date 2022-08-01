import { HttpStatus } from '@nestjs/common';
import { ApiCode } from 'src/common/constants/apiCode';
import { APIException } from 'src/common/exceptions';

export class IncorrectEmailPasswordException extends APIException {
  constructor() {
    super(
      ApiCode[400].INCORRECT_EMAIL_PASSWORD.code,
      HttpStatus.BAD_REQUEST,
      ApiCode[400].INCORRECT_EMAIL_PASSWORD.description,
    );
  }
}

export class IncorrectEmailException extends APIException {
  constructor() {
    super(
      ApiCode[400].INCORRECT_EMAIL.code,
      HttpStatus.BAD_REQUEST,
      ApiCode[400].INCORRECT_EMAIL.description,
    );
  }
}

export class UnAuthorizedException extends APIException {
  constructor() {
    super(
      ApiCode[401].UNAUTHORIZED.code,
      HttpStatus.UNAUTHORIZED,
      ApiCode[401].UNAUTHORIZED.description,
    );
  }
}

export class AccessDeniedException extends APIException {
  constructor() {
    super(
      ApiCode[403].ACCESS_DENIED.code,
      HttpStatus.FORBIDDEN,
      ApiCode[403].ACCESS_DENIED.description,
    );
  }
}

export class VerifiedUserException extends APIException {
  constructor() {
    super(
      ApiCode[400].VERIFIED_USER.code,
      HttpStatus.BAD_REQUEST,
      ApiCode[400].VERIFIED_USER.description,
    );
  }
}
