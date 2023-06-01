import { Module } from '@nestjs/common';
import { NeworderController } from './controller/Neworder.controller';
import { OrdersService } from './service/orders.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { order } from './model/order.model';
import { orderRepository } from './repository/order.repository';
import { HttpModule } from '@nestjs/axios';
import { NewCarModule } from '../newcar/newcar.module';

@Module({  
  imports: [
  TypegooseModule.forFeature([order]),
  HttpModule.register({timeout: 60000, maxRedirects: 5}),
  NewCarModule
  
],
  controllers: [NeworderController],
  providers: [OrdersService, orderRepository, NewCarModule],
  exports: [OrdersService, orderRepository]
})
export class OrderModule {}
