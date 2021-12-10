import { Injectable } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';

import { CrudService } from '../../../common/crud/crud.service';

import { CreditRequest } from '../model/creditrequest.model';
import { CreditRequestRepository } from '../repository/creditrequest.repository';

@Injectable()
export class CreditRequestService extends CrudService<CreditRequest> {
  constructor(
    readonly repository: CreditRequestRepository,
    readonly config: ConfigService,
  ) {
    super(repository, 'CreditRequest', config);
  }
};
