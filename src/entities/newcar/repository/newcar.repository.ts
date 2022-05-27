import { Injectable, Logger } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { CrudRepository } from '../../../common/crud/crud.repository';
import { NewCarGroupFilter } from '../dto/new-car-group-filter';

import { NewCar } from '../model/newcar.model';

@Injectable()
export class NewCarRepository extends CrudRepository<NewCar> {
  constructor(@InjectModel(NewCar) readonly model: ReturnModelType<typeof NewCar>) {
    super(model, 'NewCar');
  }

  async findByGroup(group: NewCarGroupFilter): Promise<NewCar[]> {
    return this.model.find(group)
  }

};
