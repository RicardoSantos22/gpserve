import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { CrudRepository } from '../../../common/crud/crud.repository';

import { recurso } from '../model/resursos.model';

let x;
@Injectable()
export class recursosRepository extends CrudRepository<typeof x> {
  constructor(@InjectModel(recurso) readonly model: ReturnModelType<typeof recurso>) {
    super(model, 'recurso');
  }

};
