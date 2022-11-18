import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { CrudRepository } from '../../../common/crud/crud.repository';

import { Agency } from '../model/agency.model';

@Injectable()
export class AgencyRepository extends CrudRepository<Agency> {
  constructor(@InjectModel(Agency) readonly model: ReturnModelType<typeof Agency>) {
    super(model, 'Agency');
  }
};
