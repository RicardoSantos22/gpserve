import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { CrudRepository } from '../../../common/crud/crud.repository';

import { InitialAssessment } from '../model/initial-assessment.model';


let x;

@Injectable()
export class InitialAssessmentRepository extends CrudRepository<typeof x> {
  constructor(@InjectModel(InitialAssessment) readonly model: ReturnModelType<typeof InitialAssessment>) {
    super(model, 'InitialAssessment');
  }
};
