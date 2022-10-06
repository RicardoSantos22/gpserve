import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from '../service/orders.service';
import { HmacDTO } from '../dto/create_hmac'

@Controller('Neworder')
export class NeworderController {
    constructor( private readonly Orderservies: OrdersService){}

    @Post("/Createhmac")
    async createkey(@Body() data:HmacDTO){

        return await this.Orderservies.CreateOrder(data);
    }
}
