import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { UsedCar } from './model/usedcar.model';
import { UsedCarController } from './controller/usedcar.controller';
import { UsedCarService } from './service/usedcar.service';

@Module({
  imports: [TypegooseModule.forFeature([UsedCar])],
  controllers: [UsedCarController],
  providers: [UsedCarService],
})

export class UsedCarModule {}
