import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { ScheduleModule } from '@nestjs/schedule'
import { NewCar } from './model/newcar.model';
import { NewCarController } from './controller/newcar.controller';
import { NewCarService } from './service/newcar.service';
import { NewCarRepository } from './repository/newcar.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypegooseModule.forFeature([NewCar]),
    HttpModule.register({timeout: 60000, maxRedirects: 5})
  ],
  controllers: [NewCarController],
  providers: [NewCarService, NewCarRepository],
})

export class NewCarModule {}
