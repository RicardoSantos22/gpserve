import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { CrudRepository } from '../../../common/crud/crud.repository';

import { User } from '../model/user.model';

@Injectable()
export class UserRepository extends CrudRepository<User> {
  constructor(@InjectModel(User) readonly model: ReturnModelType<typeof User>) {
    super(model, 'User');
  }
};
