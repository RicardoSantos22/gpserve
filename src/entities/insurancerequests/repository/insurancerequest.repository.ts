import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { CrudRepository } from '../../../common/crud/crud.repository';

import { InsuranceRequests } from '../model/insurancerequests.model';

@Injectable()
export class InsuranceRequestRepository extends CrudRepository<InsuranceRequests> {
  constructor(@InjectModel(InsuranceRequests) readonly model: ReturnModelType<typeof InsuranceRequests>) {
    super(model, 'InsuranceRequest');
  }
};
