import { Module } from '@nestjs/common';
import { NeworderController } from './controller/Neworder.controller';
import { OrdersService } from './service/orders.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { order } from './model/order.model';
import { orderRepository } from './repository/order.repository';

@Module({  
  imports: [
  TypegooseModule.forFeature([order]),
],
  controllers: [NeworderController],
  providers: [OrdersService, orderRepository]
})
export class OrderModule {}
