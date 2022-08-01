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

  [HttpStatus.CREATED]: {
    CREATE_SUCCESS: {
      code: '000',
      description: 'Create successfully!',
    },
  },

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
    EXISTED_ENTITY: {
      code: '002',
      description: 'has been existed',
    },

    // User
    PASSWORD_NOT_MATCH: {
      code: '100',
      description: "Password and confirm password don't match",
    },
    INVALID_PASSWORD: {
      code: '101',
      description: 'Password is incorrect',
    },
    SAME_OLD_NEW_PASSWORD: {
      code: '102',
      description: 'Old and new password have to be different',
    },
    VERIFIED_USER: {
      code: '103',
      description: 'Your account had already been verified',
    },
    INCORRECT_EMAIL: {
      code: '104',
      description: 'Your email is incorrecy.',
    },
    INCORRECT_EMAIL_PASSWORD: {
      code: '105',
      description: 'Your email or password is incorrect.',
    },

    // Otp
    RECENTLY_SENT_OTP: {
      code: '200',
      description: 'OTP has recently been sent',
    },
    INVALID_OTP: {
      code: '201',
      description: 'Invalid OTP.',
    },

    // Role
    REMOVE_USED_ROLE: {
      code: '200',
      description: 'Role is used.',
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

export enum EntityEnum {
  user = 'User',
  role = 'Role',
  permission = 'Permission',
  route = 'Route',
}
