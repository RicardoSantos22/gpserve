import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { InspectionAppointmentService } from '../service/inspectionappointment.service';

@Controller('inspectionappointment')
export class InspectionAppointmentController {
  constructor(private readonly service: InspectionAppointmentService) {}

  @ApiOperation({
    summary: 'Find all Inspection Appointments',
    description: 'Retrieves all the current values of Inspection Appointments that match the selected params',
  })

  @Get()
  async findAll(@Query() query: any) {
    return this.service.findAll(query);
  };
}
