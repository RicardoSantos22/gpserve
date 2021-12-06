import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { InsuranceRequests } from './model/insurancerequests.model';
import { InsuranceRequestsController } from './controller/insurancerequests.controller';
import { InsuranceRequestsService } from './service/insurancerequests.service';

@Module({
  imports: [TypegooseModule.forFeature([InsuranceRequests])],
  controllers: [InsuranceRequestsController],
  providers: [InsuranceRequestsService],
})

export class InsuranceRequestsModule {}
