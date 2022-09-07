import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { TestDriveAppointments } from './models/testdriveappointments.model';
import { TestDriveAppointmentController } from './controllers/testdriveappointment.controller';
import { TestDriveAppointmentsService } from './service/testdriveappointments.service';
import { TestDriveAppointmentRepository } from './repository/testdriveappointment.repository';


import { asesorsrespository } from '../asesores/repository/asesores.repository'
import { asesoresservice } from '../asesores/service/asesores.service'
import { Asesores } from '../asesores/model/asesores.model'
import { BucketModule } from '../../bucket/bucket.module';


@Module({
  imports: [TypegooseModule.forFeature([TestDriveAppointments, Asesores]), BucketModule],
  controllers: [TestDriveAppointmentController],
  providers: [TestDriveAppointmentsService, TestDriveAppointmentRepository, asesoresservice, asesorsrespository],
})

export class TestDriveAppointmentsModule {}
