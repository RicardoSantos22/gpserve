import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { NewCar } from './model/newcar.model';
import { NewCarController } from './controller/newcar.controller';
import { NewCarService } from './service/newcar.service';
import { NewCarRepository } from './repository/newcar.repository';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';

import { FinishedcarsModule } from '../finishedcars/finishedcars.module';

@Module({
  imports: [
    FinishedcarsModule,
    ScheduleModule.forRoot(),
    TypegooseModule.forFeature([NewCar]),
    HttpModule.register({timeout: 60000, maxRedirects: 5})
  ],
  controllers: [NewCarController],
  providers: [NewCarService, NewCarRepository],
  exports:[NewCarService, NewCarRepository]
})

export class NewCarModule {}
