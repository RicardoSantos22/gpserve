import { Injectable } from '@nestjs/common';

import { CrudService } from '../../../common/crud/crud.service';

import { Guest } from '../model/guest.model';

@Injectable()
export class GuestService extends CrudService<Guest> {}
