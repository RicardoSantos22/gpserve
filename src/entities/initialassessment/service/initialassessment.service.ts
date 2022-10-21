import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CrudService } from '../../../common/crud/crud.service';

import { InitialAssessment } from '../model/initialassessment.model';
import { InitialAssessmentRepository } from '../repository/initialassessment.repository';

@Injectable()
export class InitialAssessmentService extends CrudService<InitialAssessment> {
  constructor(
    readonly repository: InitialAssessmentRepository,
    readonly config: ConfigService,
  ) {
    super(repository, 'InitialAssessment', config);
  }
};
