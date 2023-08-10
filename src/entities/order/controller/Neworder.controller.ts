import { Body, Controller, Get, Post, Redirect } from '@nestjs/common';
import { OrdersService } from '../service/orders.service';
import { HmacDTO } from '../dto/create_hmac'

@Controller('Neworder')
export class NeworderController {
    constructor( private readonly Orderservies: OrdersService){}

    @Get("/token")
    async gettoken()
    {
        return this.Orderservies.getaccesetoken();
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
            return {
                url: 'https://estrenatuauto.com/Proceso-de-Pago?order=true' + validation.fronturl
            }
        }
        else{
            return {
                url: 'https://estrenatuauto.com/Proceso-de-Pago?order=false' + validation.fronturl
            }
        }
         
    }
}

