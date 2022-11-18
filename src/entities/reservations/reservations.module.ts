import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { Reservations } from './model/reservations.model';
import { ReservationsController } from './controller/reservations.controller';
import { ReservationsService } from './service/reservations.service';
import { ReservationRepository } from './repository/reservation.repository';

@Module({
  imports: [TypegooseModule.forFeature([Reservations])],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationRepository],
})

export class ReservationsModule {}
