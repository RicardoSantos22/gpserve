import {
    Body,
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
    ValidationPipe
  } from '@nestjs/common';

import { Findallasesores } from '../dto/findall-query'

import { CreateAsesorDTO } from '../dto/create_asesor'

import { asesoresservice } from '../service/asesores.service'

@Controller('asesores')
export class Asesorescontroller {
    constructor(private readonly service: asesoresservice) {}


      /**
   * #region findAll
   * 
   * @param {FindAllQuery} query 
   * @returns
   * @memberof asesorescontroller
   */
       @Get()
       async findAll(@Query() query: Findallasesores) {
         return this.service.getAsesores(query);
       };

       @Post()
       async create(@Body() body: CreateAsesorDTO) {
        return this.service.create(body);
      }

}
