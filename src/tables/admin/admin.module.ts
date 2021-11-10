import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { Admin } from './model/admin.model';
import { AdminController } from './controller/admin.controller';
import { AdminService } from './service/admin.service';

@Module({
  imports: [TypegooseModule.forFeature([Admin])],
  controllers: [AdminController],
  providers: [AdminService],
})

export class AdminModule {}
