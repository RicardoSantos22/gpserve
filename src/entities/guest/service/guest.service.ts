import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CrudService } from '../../../common/crud/crud.service';

import { Guest } from '../model/guest.model';
import { GuestRepository } from '../repository/guest.repository';

@Injectable()
export class GuestService extends CrudService<Guest> {
  constructor(
    readonly repository: GuestRepository,
    readonly config: ConfigService,
  ) {
    super(repository, 'Guest', config);
  }
};
