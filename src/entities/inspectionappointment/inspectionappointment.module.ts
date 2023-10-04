import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { InspectionAppointment } from './model/inspectionappointment.model';
import { InspectionAppointmentController } from './controller/inspectionappointment.controller';
import { InspectionAppointmentService } from './service/inspectionappointment.service'
import { InspectionAppointmentRepository } from './repository/inspectionappointment.repository';

@Module({
  imports: [TypegooseModule.forFeature([InspectionAppointment])],
  controllers: [InspectionAppointmentController],
  providers: [InspectionAppointmentService, InspectionAppointmentRepository],
  exports: [InspectionAppointmentModule, InspectionAppointmentService, InspectionAppointmentRepository]
})

export class InspectionAppointmentModule {}
