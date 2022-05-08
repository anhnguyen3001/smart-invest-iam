import { HttpStatus } from '@nestjs/common';

export interface Code {
  code: string;
  description: string;
}

export const ApiCode = {
  [HttpStatus.OK]: {
    DEFAULT: {
      code: '000',
      description: 'API has no specific code for this case',
    },
    SUCCESS: {
      code: '001',
      description: 'Success',
    },
    UPDATE_SUCCESS: {
      code: '002',
      description: 'Update successfully!',
    },
  },

  [HttpStatus.CREATED]: {},

  [HttpStatus.BAD_REQUEST]: {
    VALIDATION_ERROR: {
      code: '000',
      description:
        'Client sent an invalid request, such as lacking required request body or parameter',
    },
    MISSING_FIELD_HEADER: {
      code: '001',
      description: 'The something field on headers can not be found',
    },

    // User
    USER_EXISTED: {
      code: '1002',
      description: 'User has been existed',
    },
    PASSWORD_NOT_MATCH: {
      code: '1003',
      description: "Password and confirm password don't match",
    },
    OLD_PASSWORD_INCORRECT: {
      code: '1004',
      description: 'Old password is incorrect',
    },
    INVALID_TOKEN: {
      code: '1005',
      description: 'Invalid token',
    },
    VERIFIED_USER: {
      code: '1006',
      description: 'Your email had already been verified',
    },
    INVALID_CREDENTIALS: {
      code: '1005',
      description: 'Invalid credentials',
    },
    LACK_PASSWORD: {
      code: '1006',
      description: 'Lack of password to create account',
    },
    RECENTLY_SEND_MAIL: {
      code: '1007',
      description: 'Mail have recently been sent',
    },
    RECENTLY_SENT_OTP: {
      code: '1007',
      description: 'OTP has recently been sent',
    },
    EXPIRED_OTP: {
      code: '1007',
      description: 'OTP has been expired',
    },
    INVALID_OTP: {
      code: '1007',
      description: 'Invalid OTP',
    },
    UNVERIFIED_USER: {
      code: '1006',
      description: 'Your email had not been verified',
    },
  },

  [HttpStatus.UNAUTHORIZED]: {
    UNAUTHORIZED: {
      code: '000',
      description: 'Unauthorized',
    },
  },

  [HttpStatus.FORBIDDEN]: {
    ACCESS_DENIED: {
      code: '000',
      description: 'Access denied',
    },
  },

  [HttpStatus.NOT_FOUND]: {
    NOT_FOUND: {
      code: '000',
      description: 'not found',
    },
  },

  [HttpStatus.FAILED_DEPENDENCY]: {
    EXTERNAL_API_ERROR: {
      code: '000',
      description: 'Got errors when calling external API',
    },
  },

  [HttpStatus.INTERNAL_SERVER_ERROR]: {
    UNKNOWN_ERROR: {
      code: '000',
      description: 'Internal servel error',
    },
    UNHANDLED_ERROR: {
      code: '001',
      description: 'This error has not been handled',
    },
  },
};

Object.entries(ApiCode).forEach(([k, v]) => {
  const listCode = Object.keys(v);
  listCode.forEach((c) => {
    const oldCode = ApiCode[k][c]['code'];
    // join, example: 200001, 400001, ...
    ApiCode[k][c]['code'] = `${k}${oldCode}`;
  });
});

export enum NotFoundEnum {
  user = 'User',
}
