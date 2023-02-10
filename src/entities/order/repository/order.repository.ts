import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { CrudRepository } from '../../../common/crud/crud.repository';

import { order } from '../model/order.model';

let x;
@Injectable()
export class orderRepository extends CrudRepository<typeof x> {
  constructor(@InjectModel(order) readonly model: ReturnModelType<typeof order>) {
    super(model, 'order');
  }

  async findByBrands(brands: string[]): Promise<order[]> {
    return this.model.find({brand: { $in: brands }}).select('model').exec()
  }

};
