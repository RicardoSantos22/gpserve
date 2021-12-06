import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Only for dev
require('dotenv').config()

const port = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port || 3000);
}

bootstrap();
