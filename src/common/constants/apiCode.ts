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
  },

  [HttpStatus.UNAUTHORIZED]: {
    UNAUTHORIZED: {
      code: '000',
      description: 'Unauthorized',
    },
  },

  [HttpStatus.NOT_FOUND]: {},

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

export const APICode = {
  DEFAULT: {
    code: 'PMA001D',
    description: 'API has no specific code for this case',
  },

  SUCCESS: {
    code: 'PMA001S',
    description: 'Success',
  },
  CREATE_SUCCESS: {
    code: 'PMA002S',
    description: 'Create successfully!',
  },
  UPDATE_SUCCESS: {
    code: 'PMA003S',
    description: 'Update successfully!',
  },

  MISSING_FIELD_HEADER: {
    code: 'PMA001E',
    description: 'The something field on headers can not be found',
  },
  UNAUTHORIZED: {
    code: 'PMA002E',
    description: 'Unauthorized',
  },
  EXTERNAL_API_ERROR: {
    code: 'PMA003E',
    description: 'Got errors when calling external API',
  },
  UNKNOWN_ERROR: {
    code: 'PMA004E',
    description: 'Internal servel error',
  },
  VALIDATION_ERROR: {
    code: 'PMA005E',
    description:
      'Client sent an invalid request, such as lacking required request body or parameter',
  },
  UNHANDLED_ERROR: {
    code: 'PMA006E',
    description: 'This error has not been handled',
  },

  PAGE_NOT_FOUND: {
    code: 'PMA101E',
    description: 'The requested page can not be found',
  },
  UNIQUE_PAGE: {
    code: 'PMA102E',
    description: 'The page has been duplicated',
  },
  REDIRECT_SLUG_CONFLICT: {
    code: 'PMA103E',
    description: 'Slug has been existed in redirect of another page',
  },
  CATEGORY_NOT_FOUND: {
    code: 'PMA104E',
    description: 'The requested category can not be found',
  },
  TEMPLATE_NOT_FOUND: {
    code: 'PMA105E',
    description: 'The requested template can not be found',
  },
  USER_EXIST: {
    code: 'PMA106E',
    description: 'User existed on DB',
  },
  MERCHANT_NOT_FOUND: {
    code: 'PMA107E',
    description: 'The requested merchant can not be found',
  },
  PARTNER_NOT_FOUND: {
    code: 'PMA108E',
    description: 'The requested partner can not be found',
  },
  MERCHANT_DUPLICATE_CODE: {
    code: 'PMA108E',
    description: 'The merchant has been duplicated code',
  },
  USER_NOT_FOUND: {
    code: 'PMA109E',
    description: 'The requested user can not be found',
  },
  BLOCK_NOT_FOUND: {
    code: 'PMA110E',
    description: 'The requested block can not be found',
  },
  POPUP_NOT_FOUND: {
    code: 'PMA111E',
    description: 'The requested popup can not be found',
  },
  DOMAIN_DUPLICATE_NAME: {
    code: 'PMA111E',
    description: 'The domain has been duplicated name',
  },
  DEFAULT_DOMAIN_EXISTED: {
    code: 'PMA112E',
    description: 'This merchant has already default domain',
  },
  DOMAIN_NOT_FOUND: {
    code: 'PMA113E',
    description: 'The requested domain can not be found',
  },
  DELETE_DEFAULT_DOMAIN: {
    code: 'PMA114E',
    description: 'Default domain can not be deleted',
  },
  DOMAIN_NOT_VERIFIED: {
    code: 'PMA115E',
    description: 'Domain has not been configured DNS',
  },
};
