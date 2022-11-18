import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { UsedCar } from './model/usedcar.model';
import { UsedCarController } from './controller/usedcar.controller';
import { UsedCarService } from './service/usedcar.service';
import { UsedCarRepository } from './repository/usedcar.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypegooseModule.forFeature([UsedCar]),
    HttpModule.register({timeout: 20000, maxRedirects: 5})
  ],
  controllers: [UsedCarController],
  providers: [UsedCarService, UsedCarRepository],
})

export class UsedCarModule {}
