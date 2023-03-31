import { Injectable } from '@nestjs/common';
import { CreateFinishedcarDto } from '../dto/create-finishedcar.dto';
import { UpdateFinishedcarDto } from '../dto/update-finishedcar.dto';
import {ConfigService} from '@nestjs/config';

import {CrudService} from '../../../common/crud/crud.service';
import {PaginatedEntities} from '../../../common/models/paginated-entities.model';
import {Car} from '../model/finishedcars.model';
import {CarRepository} from '../repository/finishedcar.repository';

let x;

@Injectable()
export class FinishedcarsService extends CrudService<typeof x> {

  constructor(
    readonly repository: CarRepository,
    readonly config: ConfigService,
)
{
  super(repository, 'finishedcars', config);
}

async create(item: any): Promise<PaginatedEntities<Car>> {

  return await this.repository.create(item)
}

  findall() {
    return this.repository.findAll()
  }

}
