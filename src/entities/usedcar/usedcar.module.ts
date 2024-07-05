import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { UsedCar } from './model/usedcar.model';
import { UsedCarController } from './controller/usedcar.controller';
import { UsedCarService } from './service/usedcar.service';
import { UsedCarRepository } from './repository/usedcar.repository';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { FinishedcarsModule } from '../finishedcars/finishedcars.module';
import { AgencyModule } from '../agency/agency.module';
import { BugsModule } from '../bugs/bugs.module';

@Module({
  imports: [
    AgencyModule,
    FinishedcarsModule,
    ScheduleModule.forRoot(),
    TypegooseModule.forFeature([UsedCar]),
    BugsModule,
    HttpModule.register({timeout: 20000, maxRedirects: 5}),
    BugsModule,
  ],
  controllers: [UsedCarController],
  providers: [UsedCarService, UsedCarRepository],
  exports: [UsedCarService, UsedCarRepository]
})

export class UsedCarModule {}
