import { Body, Controller, Get, Post, Redirect, UploadedFile, UseInterceptors, Param,} from '@nestjs/common';
import { OrdersService } from '../service/orders.service';
import { HmacDTO } from '../dto/create_hmac'
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { FindByIdParams } from 'src/common/models/dto/params/find-by-id-params.dto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Neworder')
@Controller('Neworder')
export class NeworderController {
    constructor( private readonly Orderservies: OrdersService){}

    @Get("order/:Norder")
    async getorder(@Param('Norder') Norder: string){
        console.log(Norder)
        return this.Orderservies.findAll({Norder: Norder})
    }

    @Get("/token")
    async gettoken()
    {
        return this.Orderservies.getaccesetoken();
    }

    @Post("/createintencion")
    async createIntencion(@Body() data:HmacDTO){

        return this.Orderservies.createintencion(data)
         
    }

    @Post("/Createhmac")
    async createkey(@Body() data:HmacDTO){

       let Verifiacion = await this.Orderservies.conciliacion(data.userid)

      if(Verifiacion === true)
      {
        return await this.Orderservies.CreateOrder(data);
      }
      else{
        return Verifiacion;
      }

         
    }
    
@Redirect()
    @Post("/addorder")
    async addorder(@Body() data){

        const validation = await this.Orderservies.AddNewOrder(data);


        if(validation.orderDuplicate){

            
        console.log('http://premier-website-staging.s3-website-us-east-1.amazonaws.com/?order=true' + validation.fronturl)
            return {
                url: 'http://premier-website-staging.s3-website-us-east-1.amazonaws.com/?order=true' + validation.fronturl
            }
        }
        else{
            return {
                url: 'http://premier-website-staging.s3-website-us-east-1.amazonaws.com/?order=false' + validation.fronturl
            }
        }
         
    }
    

    @Post('/conciliacion')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file) {

        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0]; // Supongamos que solo hay una hoja en el archivo XLSX
    
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        this.Orderservies.conciliacionforDocument(sheetData)
    
        return { message: 'Archivo XLSX procesado correctamente', data: sheetData };
    }
}

