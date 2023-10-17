import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { CrudRepository } from '../../../common/crud/crud.repository';

import { banners } from '../model/banners.model';

@Injectable()
export class bannersrepository extends CrudRepository<banners> {
  constructor(@InjectModel(banners) readonly model: ReturnModelType<typeof banners>) {
    super(model, 'banners');
  }
};
