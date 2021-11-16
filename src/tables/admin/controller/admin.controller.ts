import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { AdminService } from '../service/admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @ApiOperation({
    summary: 'Find all Admins',
    description: 'Retrieves all the current values of Admins that match the selected params',
  })

  @Get()
  async findAll(@Query() query: any) {
    return this.service.findAll(query);
  };
}
