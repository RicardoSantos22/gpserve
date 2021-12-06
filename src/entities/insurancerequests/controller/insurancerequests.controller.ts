import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { InsuranceRequestsService } from '../service/insurancerequests.service';

@Controller('insurancerequests')
export class InsuranceRequestsController {
  constructor(private readonly service: InsuranceRequestsService) {}

  @ApiOperation({
    summary: 'Find all Insurance Requests',
    description: 'Retrieves all the current values of Insurance Requests that match the selected params',
  })

  @Get()
  async findAll(@Query() query: any) {
    return this.service.findAll(query);
  };
}
