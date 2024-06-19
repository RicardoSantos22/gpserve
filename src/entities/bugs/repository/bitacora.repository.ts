import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { CrudRepository } from '../../../common/crud/crud.repository';

import { Bug } from '../model/bugs.model';

@Injectable()
export class BugRepository extends CrudRepository<Bug> {
  constructor(@InjectModel(Bug) readonly model: ReturnModelType<typeof Bug>) {
    super(model, 'Bug');
  }
};

