import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { CrudRepository } from '../../../common/crud/crud.repository';

import { Guest } from '../model/guest.model';

@Injectable()
export class GuestRepository extends CrudRepository<Guest> {
  constructor(@InjectModel(Guest) readonly model: ReturnModelType<typeof Guest>) {
    super(model, 'Guest');
  }
};
