import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { NewCarService } from '../service/newcar.service';

@Controller('newcar')
export class NewCarController {
  constructor(private readonly service: NewCarService) {}

  @ApiOperation({
    summary: 'Find all New Cars',
    description: 'Retrieves all the current values of New Cars that match the selected params',
  })

  @Get()
  async findAll(@Query() query: any) {
    return this.service.findAll(query);
  };
}
