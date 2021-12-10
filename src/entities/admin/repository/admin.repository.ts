import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { CrudRepository } from '../../../common/crud/crud.repository';

import { Admin } from '../model/admin.model';

@Injectable()
export class AdminRepository extends CrudRepository<Admin> {
  constructor(@InjectModel(Admin) readonly model: ReturnModelType<typeof Admin>) {
    super(model, 'Admin');
  }
};
