import { HttpStatus } from '@nestjs/common';
import { ApiCode } from 'common/constants/apiCode';
import { APIException } from 'common/exceptions';

export class InvalidCredentialException extends APIException {
  constructor(message = ApiCode[400].INVALID_CREDENTIALS.description) {
    super(
      ApiCode[400].INVALID_CREDENTIALS.code,
      HttpStatus.BAD_REQUEST,
      message,
      undefined,
    );
  }
}

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

export class VerifiedUserException extends APIException {
  constructor(message = ApiCode[400].VERIFIED_USER.description) {
    super(
      ApiCode[400].VERIFIED_USER.code,
      HttpStatus.BAD_REQUEST,
      message,
      undefined,
    );
  }
}

export class UserNotFoundException extends APIException {
  constructor(message = ApiCode[404].USER_NOT_FOUND.description) {
    super(
      ApiCode[404].USER_NOT_FOUND.code,
      HttpStatus.NOT_FOUND,
      message,
      undefined,
    );
  }
}