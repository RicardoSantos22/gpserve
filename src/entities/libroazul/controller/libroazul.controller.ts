import { Body, Controller, Get, Post } from '@nestjs/common';
import { LibroazulService } from '../service/libroazul.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('libroazul')
@Controller('libroazul')
export class LibroazulController {

    constructor(private readonly LBS: LibroazulService ){}
    @Get()
    async getkey(){
        return await this.LBS.findAll();
    }

    @Post("/year")
    async getmarcas(@Body() data: any){     
       
    return await this.LBS.obtenermarcas(data)
    }

    @Post("/modelos")
    async getmodelos(@Body() data: any)
    {
        return this.LBS.obtenermodelos(data);
    }

    @Post("/version")
    async getversion(@Body() data: any){

        return this.LBS.obtenerversiones(data);
    }
    @Post("/precio")
    async getprecio(@Body() data: any){
        return this.LBS.obtenerprecio(data)
    }

}
