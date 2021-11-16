import { Injectable } from '@nestjs/common';

import { CrudService } from '../../../common/crud/crud.service';

import { Agency } from '../model/agency.model';

@Injectable()
export class AgencyService extends CrudService<Agency> {}
