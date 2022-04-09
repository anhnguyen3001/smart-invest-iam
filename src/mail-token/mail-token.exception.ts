import { HttpStatus } from '@nestjs/common';
import { ApiCode } from 'common/constants/apiCode';
import { APIException } from 'common/exceptions';

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
