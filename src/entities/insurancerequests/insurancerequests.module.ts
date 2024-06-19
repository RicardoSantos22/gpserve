import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { HttpModule } from '@nestjs/axios';

import { InsuranceRequests } from './model/insurancerequests.model';
import { InsuranceRequestsController } from './controller/insurancerequests.controller';
import { InsuranceRequestsService } from './service/insurancerequests.service';
import { InsuranceRequestRepository } from './repository/insurancerequest.repository';

import { asesorsrespository } from '../asesores/repository/asesores.repository'
import { asesoresservice } from '../asesores/service/asesores.service'
import { BucketModule } from '../../bucket/bucket.module';
import { BugsModule } from '../bugs/bugs.module';
import { AsesoresModule } from '../asesores/asesores.module';

@Module({
  imports: [TypegooseModule.forFeature([InsuranceRequests]), BucketModule, HttpModule.register({}), BugsModule, AsesoresModule],
  controllers: [InsuranceRequestsController],
  providers: [InsuranceRequestsService, InsuranceRequestRepository],
  exports: [InsuranceRequestRepository, InsuranceRequestsModule, InsuranceRequestsService]
})

export class InsuranceRequestsModule {}
