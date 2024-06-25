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
import { FindByIdParams, DeleteParams } from '../../../common/models/dto/params';
import { UpdateBugDto } from '../dto/update-bug.dto';


@Controller('bugs')
export class BugsController {
  constructor(private readonly bugsService: BugsService) {}
  @Get()
  async findAll(@Query() query: FindAllBugsQuery) 
  {
    return this.bugsService.findAll(query)
  }

  
  @Get(':id')
  async findById(@Param() params: FindByIdParams) { 
    return this.bugsService.findById(params.id)
  }

  @Patch(':id')
  async update(@Param() params: FindByIdParams, @Body() body: UpdateBugDto) { 
    console.log(body)
    return this.bugsService.update(params.id, body)
  }
  
}
