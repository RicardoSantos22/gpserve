import { Injectable } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';

import { CrudService } from '../../../common/crud/crud.service';

import { Reservations } from '../model/reservations.model';
import { ReservationRepository } from '../repository/reservation.repository';

@Injectable()
export class ReservationsService extends CrudService<Reservations> {
  constructor(
    readonly repository: ReservationRepository,
    readonly config: ConfigService,
  ) {
    super(repository, 'Reservation', config);
  }
};
