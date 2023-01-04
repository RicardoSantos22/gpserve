import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CrudService } from '../../../common/crud/crud.service';
import { FindAllQuery } from '../../../common/models/dto/query';
import { PaginatedEntities } from '../../../common/models/paginated-entities.model';
import { CarSaleRequest } from '../model/carsalerequest.model';
import { CarSaleRequestRepository } from '../repository/carsalerequest.repository';

let x;

@Injectable()
export class CarSaleRequestService extends CrudService<typeof x> {
  constructor(
    readonly repository: CarSaleRequestRepository,
    readonly config: ConfigService,
  ) {
    super(repository, 'CarSaleRequest', config);
  }

  async findAll(query: FindAllQuery): Promise<PaginatedEntities<CarSaleRequest>> {
    const result = await this.repository.findAll(query)
    return result
  }

};
