import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { mongoFactory } from './config/database.config';

@Module({
  imports: [
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mongoFactory,
      inject: [ConfigService],
    }),
  ]
})

export class AppModule {}
