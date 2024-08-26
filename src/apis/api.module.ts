import { Module } from '@nestjs/common';
import { SendGridModule } from './sendgrid/sendgird.module';

@Module({
  imports: [SendGridModule],
})
export class ApisModule {}
