import {   Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe } from '@nestjs/common';
import { RecursosService } from '../service/recursos.service';
import { CreateRecursoDto } from '../dto/create-recurso.dto';
import { UpdateRecursoDto } from '../dto/update-recurso.dto';
import { FindAllRecursosQuery } from '../dto/findAll.dto';

@Controller('recursos')
export class RecursosController {
  constructor(private readonly recursosService: RecursosService) {}

  @Get()
  findAll(@Query() query: FindAllRecursosQuery) {
    return this.recursosService.findAll(query);
  }

}
