import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { CrudRepository } from '../../../common/crud/crud.repository';

import { UsedCar } from '../model/usedcar.model';

@Injectable()
export class UsedCarRepository extends CrudRepository<UsedCar> {
  constructor(@InjectModel(UsedCar) readonly model: ReturnModelType<typeof UsedCar>) {
    super(model, 'UsedCar');
  }

  async findByBrands(brands: string[]): Promise<UsedCar[]> {
    return this.model.find({brand: { $in: brands }}).select('model').exec()
  }

};
