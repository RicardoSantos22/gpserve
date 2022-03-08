import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CrudService } from '../../../common/crud/crud.service';

import { UsedCar } from '../model/usedcar.model';
import { UsedCarRepository } from '../repository/usedCar.repository';

@Injectable()
export class UsedCarService extends CrudService<UsedCar> {
  constructor(
    readonly repository: UsedCarRepository,
    readonly config: ConfigService,
  ) {
    super(repository, 'UsedCar', config);
  }
};
