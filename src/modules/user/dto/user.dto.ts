import { Type } from 'class-transformer';
import { User } from 'src/entities';

export class ResultUserDto {
  @Type(() => User)
  user: User;
}
