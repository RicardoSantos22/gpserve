import { Module } from '@nestjs/common';
import { NeworderController } from './controller/Neworder.controller';
import { OrdersService } from './service/orders.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { order } from './model/order.model';
import { orderRepository } from './repository/order.repository';
import { HttpModule } from '@nestjs/axios';
import { NewCarModule } from '../newcar/newcar.module';
import { UsedCarModule } from '../usedcar/usedcar.module';

@Module({  
  imports: [
  TypegooseModule.forFeature([order]),
  HttpModule.register({timeout: 60000, maxRedirects: 5}),
  NewCarModule,
  UsedCarModule
  
],
  controllers: [NeworderController],
  providers: [OrdersService, orderRepository, NewCarModule, UsedCarModule],
  exports: [OrdersService, orderRepository, OrderModule]
})
export class OrderModule {}
