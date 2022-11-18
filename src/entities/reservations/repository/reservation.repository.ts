import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { CrudRepository } from '../../../common/crud/crud.repository';

import { Reservations } from '../model/reservations.model';

@Injectable()
export class ReservationRepository extends CrudRepository<Reservations> {
  constructor(@InjectModel(Reservations) readonly model: ReturnModelType<typeof Reservations>) {
    super(model, 'Reservation');
  }
};
