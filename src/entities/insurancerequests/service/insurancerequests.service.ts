import { Injectable } from '@nestjs/common';

import { CrudService } from '../../../common/crud/crud.service';

import { InsuranceRequests } from '../model/insurancerequests.model';

@Injectable()
export class InsuranceRequestsService extends CrudService<InsuranceRequests> {}
