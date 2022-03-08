import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CrudService } from '../../../common/crud/crud.service';

import { InsuranceRequests } from '../model/insurancerequests.model';
import { InsuranceRequestRepository } from '../repository/insurancerequest.repository';

@Injectable()
export class InsuranceRequestsService extends CrudService<InsuranceRequests> {
  constructor(
    readonly repository: InsuranceRequestRepository,
    readonly config: ConfigService,
  ) {
    super(repository, 'InsuranceRequest', config);
  }
};
