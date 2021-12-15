import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { TestDriveAppointments } from './models/testdriveappointments.model';
import { TestDriveAppointmentController } from './controllers/testdriveappointment.controller';
import { TestDriveAppointmentsService } from './service/testdriveappointments.service';
import { TestDriveAppointmentRepository } from './repository/testdriveappointment.repository';

@Module({
  imports: [TypegooseModule.forFeature([TestDriveAppointments])],
  controllers: [TestDriveAppointmentController],
  providers: [TestDriveAppointmentsService, TestDriveAppointmentRepository],
})

export class TestDriveAppointmentsModule {}
