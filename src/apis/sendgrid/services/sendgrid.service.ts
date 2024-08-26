import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  private readonly sendGridApiKey: string = '';
  private logger: Logger;
  constructor(private readonly configService: ConfigService) {
    this.sendGridApiKey = this.configService.get<string>('sendGrid.apiKey');
    this.logger = new Logger(this.sendGridApiKey);
    SendGrid.setApiKey(this.sendGridApiKey);
  }

  private async send(mail: SendGrid.MailDataRequired) {
    try {
      const response = await SendGrid.send(mail);
      this.logger.log(`Email successfully dispatched to ${mail.to as string}`);
      return {
        status: true,
        message: 'Se ha enviado el correo exitosamente',
        statusCode: 200,
      };
    } catch (error) {
      //You can do more with the error
      this.logger.error('Error while sending email', error);
      return {
        status: false,
        message:
          'Error al enviar el correo, verifique si su correo esta correcto',
        statusCode: 400,
      };
    }
  }

  async sendEmail(recipient: string, body = 'This is a test mail') {
    const mail: SendGrid.MailDataRequired = {
      to: recipient,
      from: 'contacto@estrenatuauto.com', //Approved sender ID in Sendgrid
      cc: 'fsuastegui@kalyptio.com',
      subject: 'Grupo Premier',
      content: [{ type: 'text/plain', value: body }],
    };
    const emailResponse = await this.send(mail);
    if (emailResponse.status) {
      return emailResponse;
    }
    return new BadRequestException(emailResponse.message);
  }

  async sendEmailWithTemplate(recipient: string, body: string): Promise<void> {
    const mail: SendGrid.MailDataRequired = {
      to: recipient,
      cc: 'example@mail.com', //Assuming you want to send a copy to this email
      from: 'noreply@domain.com', //Approved sender ID in Sendgrid
      templateId: 'Sendgrid_template_ID', //Retrieve from config service or environment variable
      dynamicTemplateData: { body, subject: 'Send Email with template' }, //The data to be used in the template
    };
    await this.send(mail);
  }
}
