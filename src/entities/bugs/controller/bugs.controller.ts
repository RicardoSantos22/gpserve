import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
  Req
} from '@nestjs/common';

import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse
} from '@nestjs/swagger';

import { BugsService } from '../service/bugs.service';
import { FindAllBugsQuery } from '../dto/findall-query';


@Controller('bugs')
export class BugsController {
  constructor(private readonly bugsService: BugsService) {}
  @Get()
  async findAll(@Query() query: FindAllBugsQuery) 
  {
    return this.bugsService.findAll(query)
  }
}
