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
