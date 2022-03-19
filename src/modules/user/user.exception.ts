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
