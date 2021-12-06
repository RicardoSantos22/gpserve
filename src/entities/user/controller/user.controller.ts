import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @ApiOperation({
    summary: 'Find all Users',
    description: 'Retrieves all the current values of Users that match the selected params',
  })

  @Get()
  async findAll(@Query() query: any) {
    return this.service.findAll(query);
  };
}
