import { HttpStatus } from '@nestjs/common';
import { ApiCode } from 'src/common/constants/apiCode';
import { APIException } from 'src/common/exceptions';

export class InvalidCredentialException extends APIException {
  constructor() {
    super(
      ApiCode[400].INVALID_CREDENTIALS.code,
      HttpStatus.BAD_REQUEST,
      ApiCode[400].INVALID_CREDENTIALS.description,
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

export class InvalidTokenException extends APIException {
  constructor() {
    super(
      ApiCode[400].INVALID_TOKEN.code,
      HttpStatus.BAD_REQUEST,
      ApiCode[400].INVALID_TOKEN.description,
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

export class UnverifiedUserException extends APIException {
  constructor() {
    super(
      ApiCode[400].UNVERIFIED_USER.code,
      HttpStatus.BAD_REQUEST,
      ApiCode[400].UNVERIFIED_USER.description,
    );
  }
}
