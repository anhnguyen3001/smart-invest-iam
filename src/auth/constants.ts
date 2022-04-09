import { configService } from 'config/config.service';

export const JWT_SECRET_KEY = {
  at: configService.getValue('ACCESS_TOKEN_SECRET'),
  rt: configService.getValue('REFRESH_TOKEN_SECRET'),
};
