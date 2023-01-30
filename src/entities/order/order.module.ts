import { Module } from '@nestjs/common';
import { NeworderController } from './controller/Neworder.controller';
import { OrdersService } from './service/orders.service';

@Module({
  controllers: [NeworderController],
  providers: [OrdersService]
})
export class OrderModule {}
