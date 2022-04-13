import { configService } from 'config/config.service';

export const JWT_SECRET_KEY = {
  at: configService.getValue('ACCESS_TOKEN_SECRET'),
  rt: configService.getValue('REFRESH_TOKEN_SECRET'),
  resetPass: configService.getValue('RESET_PASS_KEY'),
};
