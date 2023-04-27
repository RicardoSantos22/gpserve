import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { HttpModule } from '@nestjs/axios';

import { InsuranceRequests } from './model/insurancerequests.model';
import { InsuranceRequestsController } from './controller/insurancerequests.controller';
import { InsuranceRequestsService } from './service/insurancerequests.service';
import { InsuranceRequestRepository } from './repository/insurancerequest.repository';

import { asesorsrespository } from '../asesores/repository/asesores.repository'
import { asesoresservice } from '../asesores/service/asesores.service'
import { Asesores } from '../asesores/model/asesores.model'
import { BucketModule } from '../../bucket/bucket.module';

@Module({
  imports: [TypegooseModule.forFeature([InsuranceRequests, Asesores]), BucketModule, HttpModule.register({})],
  controllers: [InsuranceRequestsController],
  providers: [InsuranceRequestsService, InsuranceRequestRepository, asesoresservice, asesorsrespository],
})

export class InsuranceRequestsModule {}
