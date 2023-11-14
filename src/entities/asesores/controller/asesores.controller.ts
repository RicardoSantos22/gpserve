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

import { FindAllAsesoresDto } from '../dto/findall-query'

import { CreateAsesorDTO } from '../dto/create_asesor'

import { asesoresservice } from '../service/asesores.service'
import { FindByIdParams } from 'src/common/models/dto/params';
import { karbotCreateLead } from '../model/Karbot.response';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('asesores')
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
       async findAll(@Query() query: FindAllAsesoresDto) {
         return this.service.getAsesores(query);
       };

       @Get('/karbotlogin')
       async karbotLogin(){
        return this.service.login();
       }

       @Post('/Createlead')
       async Createlead(@Body() karbotSesion: any){

        return this.service.createLead(karbotSesion)
        // return 0
       }

       
      
       @Get('/all')
       async findAllAdvisors(@Query() query: FindAllAsesoresDto) {
         return this.service.findAll(query);
       };

       @Get(':id')
       async findById(@Param() params: FindByIdParams) {
         return this.service.findById(params.id);
       }

       @Post()
       async create(@Body() body: CreateAsesorDTO) {
        return this.service.create(body);
      }

}
