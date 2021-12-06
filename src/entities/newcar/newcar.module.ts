import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { NewCar } from './model/newcar.model';
import { NewCarController } from './controller/newcar.controller';
import { NewCarService } from './service/newcar.service';

@Module({
  imports: [TypegooseModule.forFeature([NewCar])],
  controllers: [NewCarController],
  providers: [NewCarService],
})

export class NewCarModule {}
