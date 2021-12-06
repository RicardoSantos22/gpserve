import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { CreditRequestService } from '../service/creditrequest.service';

@Controller('admin')
export class CreditRequestController {
  constructor(private readonly service: CreditRequestService) {}

  @ApiOperation({
    summary: 'Find all Credit Requests',
    description: 'Retrieves all the current values of Credit Requests that match the selected params',
  })

  @Get()
  async findAll(@Query() query: any) {
    return this.service.findAll(query);
  };
}
