import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { CrudRepository } from '../../../common/crud/crud.repository';

import { Car } from '../model/finishedcars.model';

let x;
@Injectable()
export class CarRepository extends CrudRepository<typeof x> {
  constructor(@InjectModel(Car) readonly model: ReturnModelType<typeof Car>) {
    super(model, 'Car');
  }

  async findByBrands(brands: string[]): Promise<Car[]> {
    return this.model.find({brand: { $in: brands }}).select('model').exec()
  }

};
