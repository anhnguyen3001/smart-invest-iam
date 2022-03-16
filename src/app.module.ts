import { Module } from '@nestjs/common';
import { AuthModule } from './auth';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
