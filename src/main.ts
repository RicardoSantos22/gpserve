import { NestFactory } from '@nestjs/core';

import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

// Only for dev
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  
  const port = process.env.PORT;
  app.setGlobalPrefix('api')
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


  await app.listen(port || 3000, '0.0.0.0');
}

bootstrap();
