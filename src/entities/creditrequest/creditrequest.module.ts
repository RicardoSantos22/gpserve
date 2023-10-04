import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { HttpModule } from '@nestjs/axios';

import { CreditRequest } from './model/creditrequest.model';
import { CreditRequestService } from './service/creditrequest.service';
import { CreditRequestController } from './controller/creditrequest.controller';
import { CreditRequestRepository } from './repository/creditrequest.repository';
import { asesorsrespository } from '../asesores/repository/asesores.repository'
import { asesoresservice } from '../asesores/service/asesores.service'
import { Asesores } from '../asesores/model/asesores.model'
import { BucketModule } from '../../bucket/bucket.module';

@Module({
  imports: [TypegooseModule.forFeature([CreditRequest, Asesores]), BucketModule, HttpModule.register({})],
  controllers: [CreditRequestController],
  providers: [CreditRequestService, CreditRequestRepository, asesoresservice, asesorsrespository],
  exports: [CreditRequestModule, CreditRequestRepository, CreditRequestService]
})

export class CreditRequestModule {}
