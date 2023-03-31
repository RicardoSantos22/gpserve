import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FinishedcarsService } from '../service/finishedcars.service';
import { CreateFinishedcarDto } from '../dto/create-finishedcar.dto';
import { UpdateFinishedcarDto } from '../dto/update-finishedcar.dto';

@Controller('finishedcars')
export class FinishedcarsController {
  constructor(private readonly finishedcarsService: FinishedcarsService) {}

  @Post()
  create(@Body() createFinishedcarDto: CreateFinishedcarDto) {
    return this.finishedcarsService.create(createFinishedcarDto);
  }

  @Get()
  findAll() {
    return this.finishedcarsService.findall();
  }

}
