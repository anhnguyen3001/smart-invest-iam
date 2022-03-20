import { configService } from 'src/config';

export const JWT_SECRET_KEY = {
  at: configService.getValue('ACCESS_TOKEN_SECRET'),
  rt: configService.getValue('REFRESH_TOKEN_SECRET'),
};
