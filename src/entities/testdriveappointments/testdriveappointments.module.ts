import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { HttpModule } from '@nestjs/axios';

import { TestDriveAppointments } from './models/testdriveappointments.model';
import { TestDriveAppointmentController } from './controllers/testdriveappointment.controller';
import { TestDriveAppointmentsService } from './service/testdriveappointments.service';
import { TestDriveAppointmentRepository } from './repository/testdriveappointment.repository';


import { asesorsrespository } from '../asesores/repository/asesores.repository'
import { asesoresservice } from '../asesores/service/asesores.service'
import { Asesores } from '../asesores/model/asesores.model'
import { BucketModule } from '../../bucket/bucket.module';
import { BugsModule } from '../bugs/bugs.module';
import { AsesoresModule } from '../asesores/asesores.module';


@Module({
  imports: [TypegooseModule.forFeature([TestDriveAppointments]), BucketModule, HttpModule.register({}), BugsModule, AsesoresModule],
  controllers: [TestDriveAppointmentController],
  providers: [TestDriveAppointmentsService, TestDriveAppointmentRepository,],
  exports: [TestDriveAppointmentsModule, TestDriveAppointmentsService, TestDriveAppointmentRepository]
})

export class TestDriveAppointmentsModule {}
