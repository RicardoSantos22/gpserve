import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { InsuranceRequests } from './model/insurancerequests.model';
import { InsuranceRequestsController } from './controller/insurancerequests.controller';
import { InsuranceRequestsService } from './service/insurancerequests.service';
import { InsuranceRequestRepository } from './repository/insurancerequest.repository';

@Module({
  imports: [TypegooseModule.forFeature([InsuranceRequests])],
  controllers: [InsuranceRequestsController],
  providers: [InsuranceRequestsService, InsuranceRequestRepository],
})

export class InsuranceRequestsModule {}
