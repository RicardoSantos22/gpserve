import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { CrudRepository } from '../../../common/crud/crud.repository';

import { CreditRequest } from '../model/creditrequest.model';

@Injectable()
export class CreditRequestRepository extends CrudRepository<CreditRequest> {
  constructor(@InjectModel(CreditRequest) readonly model: ReturnModelType<typeof CreditRequest>) {
    super(model, 'CreditRequest');
  }

  async findAllbyDate(start: string, end: string) {
    return this.model.find({ createdAt: { $gte: start, $lte: end } }).exec()
  }
};
