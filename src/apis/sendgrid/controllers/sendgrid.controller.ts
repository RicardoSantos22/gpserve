import { Body, Controller, Post } from '@nestjs/common';
import { SendEmail } from '../dtos/email';
import { SendGridService } from '../services/sendgrid.service';

@Controller('sendgrid')
export class SendGridController {
  constructor(private readonly sendGridService: SendGridService) {}

  @Post('send-email')
  sendEmail(@Body() body: SendEmail) {
    return this.sendGridService.sendEmail(body.to, body.message);
  }
}
