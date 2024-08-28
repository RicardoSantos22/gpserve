import { Module } from '@nestjs/common';
import { SendGridController } from './controllers/sendgrid.controller';
import { SendGridService } from './services/sendgrid.service';

@Module({
  imports: [],
  controllers: [SendGridController],
  providers: [SendGridService],
})
export class SendGridModule {}
