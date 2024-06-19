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
import { CreateBugDto } from '../dto/create-bug.dto';
import { UpdateBugDto } from '../dto/update-bug.dto';
import { FindAllBugsQuery } from '../dto/findall-query';

@Controller('bugs')
export class BugsController {
  constructor(private readonly bugsService: BugsService) {}

  @Post()
  create(@Body() createBugDto: CreateBugDto) {
    return this.bugsService.create(createBugDto);
  }

  @Get()
  findAll(@Query() query: FindAllBugsQuery,  @Req() req: Request) {
    return this.bugsService.findAll(query);
  }

}
