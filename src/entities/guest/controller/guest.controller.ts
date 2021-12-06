import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { GuestService } from '../service/guest.service';

@Controller('guest')
export class GuestController {
  constructor(private readonly service: GuestService) {}

  @ApiOperation({
    summary: 'Find all Guests',
    description: 'Retrieves all the current values of Guests that match the selected params',
  })

  @Get()
  async findAll(@Query() query: any) {
    return this.service.findAll(query);
  };
}
