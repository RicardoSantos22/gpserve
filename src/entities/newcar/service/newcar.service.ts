import { Injectable } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';

import { CrudService } from '../../../common/crud/crud.service';

import { NewCar } from '../model/newcar.model';
import { NewCarRepository } from '../repository/newcar.fepository';

@Injectable()
export class NewCarService extends CrudService<NewCar> {
  constructor(
    readonly repository: NewCarRepository,
    readonly config: ConfigService,
  ) {
    super(repository, 'NewCar', config);
  }
};
