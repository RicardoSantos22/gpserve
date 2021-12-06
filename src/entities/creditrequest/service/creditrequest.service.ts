import { Injectable } from '@nestjs/common';

import { CrudService } from '../../../common/crud/crud.service';

import { CreditRequest } from '../model/creditrequest.model';

@Injectable()
export class CreditRequestService extends CrudService<CreditRequest> {}
