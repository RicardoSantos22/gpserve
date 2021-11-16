import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { AgencyService } from '../service/agency.service';

@Controller('agency')
export class AgencyController {
  constructor(private readonly service: AgencyService) {}

  @ApiOperation({
    summary: 'Find all Agencies',
    description: 'Retrieves all the current values of Agencies that match the selected params',
  })

  @Get()
  async findAll(@Query() query: any) {
    return this.service.findAll(query);
  };
}
