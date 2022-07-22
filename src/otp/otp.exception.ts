import { HttpStatus } from '@nestjs/common';
import { ApiCode } from 'common/constants/apiCode';
import { APIException } from 'common/exceptions';

export class RecentlySentOtpException extends APIException {
  constructor() {
    super(
      ApiCode[400].RECENTLY_SENT_OTP.code,
      HttpStatus.BAD_REQUEST,
      ApiCode[400].RECENTLY_SENT_OTP.description,
    );
  }
}

export class InvalidCodeException extends APIException {
  constructor() {
    super(
      ApiCode[400].INVALID_OTP.code,
      HttpStatus.BAD_REQUEST,
      ApiCode[400].INVALID_OTP.description,
    );
  }
}
