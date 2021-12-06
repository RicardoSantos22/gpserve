import { Injectable } from '@nestjs/common';

import { CrudService } from '../../../common/crud/crud.service';

import { Reservations } from '../model/reservations.model';

@Injectable()
export class ReservationsService extends CrudService<Reservations> {}
