import { HttpStatus } from '@nestjs/common';
import { ApiCode } from 'common/constants/apiCode';
import { APIException } from 'common/exceptions';

export class RemovedUsedRoleException extends APIException {
  constructor() {
    super(
      ApiCode[400].EXISTED_ENTITY.code,
      HttpStatus.BAD_REQUEST,
      ApiCode[400].EXISTED_ENTITY.code,
    );
  }
}
