import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CrudService } from '../../../common/crud/crud.service';
import { FindAllQuery } from '../../../common/models/dto/query';
import { PaginatedEntities } from '../../../common/models/paginated-entities.model';

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

  async findAll(query: FindAllQuery): Promise<PaginatedEntities<CreditRequest>> {
    const result = await this.repository.findAll(query)
    return result
  }

};
