import { NestFactory } from '@nestjs/core';

import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

// Only for dev
require('dotenv').config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const port = process.env.PORT;

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  await app.listen(port || 3000);
}

bootstrap();
