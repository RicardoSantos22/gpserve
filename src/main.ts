import { NestFactory } from '@nestjs/core';

import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as compression from 'compression';

// Only for dev
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(compression());
  const port = process.env.PORT;
  app.setGlobalPrefix('api');
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true,
  //     transformOptions: {
  //       enableImplicitConversion: false,
  //     },
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     forbidUnknownValues: true,
  //   }),
  // );

  const config = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();

  await app.listen(port || 3000, '0.0.0.0');
}

bootstrap();
