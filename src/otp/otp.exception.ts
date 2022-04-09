import { HttpStatus } from '@nestjs/common';
import { ApiCode } from 'common/constants/apiCode';
import { APIException } from 'common/exceptions';

export class RecentlySentOtpException extends APIException {
  constructor(message = ApiCode[400].RECENTLY_SENT_OTP.description) {
    super(
      ApiCode[400].RECENTLY_SENT_OTP.code,
      HttpStatus.BAD_REQUEST,
      message,
      undefined,
    );
  }
}

export class ExpiredOtpException extends APIException {
  constructor(message = ApiCode[400].EXPIRED_OTP.description) {
    super(
      ApiCode[400].EXPIRED_OTP.code,
      HttpStatus.BAD_REQUEST,
      message,
      undefined,
    );
  }
}

export class InvalidCodeException extends APIException {
  constructor(message = ApiCode[400].INVALID_OTP.description) {
    super(
      ApiCode[400].INVALID_OTP.code,
      HttpStatus.BAD_REQUEST,
      message,
      undefined,
    );
  }
}
