import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { CrudRepository } from '../../../common/crud/crud.repository';
import { CarSaleRequest } from '../model/carsalerequest.model';


@Injectable()
export class CarSaleRequestRepository extends CrudRepository<CarSaleRequest> {
  constructor(@InjectModel(CarSaleRequest) readonly model: ReturnModelType<typeof CarSaleRequest>) {
    super(model, 'CarSaleRequest');
  }
};
