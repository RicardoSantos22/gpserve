import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { CrudRepository } from '../../../common/crud/crud.repository';

import { NewCar } from '../model/newcar.model';

@Injectable()
export class NewCarRepository extends CrudRepository<NewCar> {
  constructor(@InjectModel(NewCar) readonly model: ReturnModelType<typeof NewCar>) {
    super(model, 'NewCar');
  }
};
