import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { Agency } from './model/agency.model';
import { AgencyController } from './controller/agency.controller';
import { AgencyService } from './service/agency.service';

@Module({
  imports: [TypegooseModule.forFeature([Agency])],
  controllers: [AgencyController],
  providers: [AgencyService],
})

export class AgencyModule {}
