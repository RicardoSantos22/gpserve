import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { CreditRequest } from './model/creditrequest.model';
import { CreditRequestService } from './service/creditrequest.service';
import { CreditRequestController } from './controller/creditrequest.controller';

@Module({
  imports: [TypegooseModule.forFeature([CreditRequest])],
  controllers: [CreditRequestController],
  providers: [CreditRequestService],
})

export class CreditRequestModule {}
