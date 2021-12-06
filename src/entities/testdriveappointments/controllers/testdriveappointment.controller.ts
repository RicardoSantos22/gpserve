import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { TestDriveAppointmentsService } from '../service/testdriveappointments.service';

@Controller('testdriveappointment')
export class TestDriveAppointmentController {
  constructor(private readonly service: TestDriveAppointmentsService) {}

  @ApiOperation({
    summary: 'Find all Test Drive Appointments',
    description: 'Retrieves all the current values of Test Drive Appointments that match the selected params',
  })

  @Get()
  async findAll(@Query() query: any) {
    return this.service.findAll(query);
  };
}
