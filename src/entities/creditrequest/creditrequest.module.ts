import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { HttpModule } from '@nestjs/axios';

import { CreditRequest } from './model/creditrequest.model';
import { CreditRequestService } from './service/creditrequest.service';
import { CreditRequestController } from './controller/creditrequest.controller';
import { CreditRequestRepository } from './repository/creditrequest.repository';
import { asesorsrespository } from '../asesores/repository/asesores.repository'
import { asesoresservice } from '../asesores/service/asesores.service'
import { BucketModule } from '../../bucket/bucket.module';
import { BugsModule } from '../bugs/bugs.module';
import { AsesoresModule } from '../asesores/asesores.module';

@Module({
  imports: [TypegooseModule.forFeature([CreditRequest]), BucketModule, HttpModule.register({}), BugsModule],
  controllers: [CreditRequestController],
  providers: [CreditRequestService, CreditRequestRepository,],
  exports: [CreditRequestModule, CreditRequestRepository, CreditRequestService]
})

export class CreditRequestModule {}
