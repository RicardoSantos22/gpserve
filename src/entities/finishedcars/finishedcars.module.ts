import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { FinishedcarsService } from './service/finishedcars.service';
import { FinishedcarsController } from './controller/finishedcars.controller';
import { Car } from './model/finishedcars.model';
import { CarRepository } from './repository/finishedcar.repository';

@Module({
  imports:[TypegooseModule.forFeature([Car])],
  controllers: [FinishedcarsController],
  providers: [FinishedcarsService, CarRepository],
  exports: [FinishedcarsService],
})
export class FinishedcarsModule {}
