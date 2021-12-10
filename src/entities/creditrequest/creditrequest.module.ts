import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { CreditRequest } from './model/creditrequest.model';
import { CreditRequestService } from './service/creditrequest.service';
import { CreditRequestController } from './controller/creditrequest.controller';
import { CreditRequestRepository } from './repository/creditrequest.repository';

@Module({
  imports: [TypegooseModule.forFeature([CreditRequest])],
  controllers: [CreditRequestController],
  providers: [CreditRequestService, CreditRequestRepository],
})

export class CreditRequestModule {}
