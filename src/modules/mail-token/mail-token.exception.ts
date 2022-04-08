import { HttpStatus } from '@nestjs/common';
import { ApiCode, APIException } from 'src/common';

export class RecentlyCreateException extends APIException {
  constructor(message = ApiCode[400].RECENTLY_SEND_MAIL.description) {
    super(
      ApiCode[400].RECENTLY_SEND_MAIL.code,
      HttpStatus.BAD_REQUEST,
      message,
      undefined,
    );
  }
}
