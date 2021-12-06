import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { InspectionAppointment } from './model/inspectionappointment.model';
import { InspectionAppointmentController } from './controller/inspectionappointment.controller';
import { InspectionAppointmentService } from './service/inspectionappointment.service';

@Module({
  imports: [TypegooseModule.forFeature([InspectionAppointment])],
  controllers: [InspectionAppointmentController],
  providers: [InspectionAppointmentService],
})

export class InspectionAppointmentModule {}
