import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { UsedCarService } from '../service/usedcar.service';

@Controller('usedcar')
export class UsedCarController {
  constructor(private readonly service: UsedCarService) {}

  @ApiOperation({
    summary: 'Find all Used Cars',
    description: 'Retrieves all the current values of Used Cars that match the selected params',
  })

  @Get()
  async findAll(@Query() query: any) {
    return this.service.findAll(query);
  };
}
