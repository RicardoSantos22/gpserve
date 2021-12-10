import { Injectable } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';

import { CrudService } from '../../../common/crud/crud.service';

import { Agency } from '../model/agency.model';
import { AgencyRepository } from '../repository/agency.repository';

@Injectable()
export class AgencyService extends CrudService<Agency> {
  constructor(
    readonly repository: AgencyRepository,
    readonly config: ConfigService,
  ) {
    super(repository, 'Agency', config);
  }
};
