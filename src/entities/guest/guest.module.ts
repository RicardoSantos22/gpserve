import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { Guest } from './model/guest.model';
import { GuestController } from './controller/guest.controller';
import { GuestService } from './service/guest.service';
import { GuestRepository } from './repository/guest.repository';

@Module({
  imports: [TypegooseModule.forFeature([Guest])],
  controllers: [GuestController],
  providers: [GuestService, GuestRepository],
})

export class GuestModule {}
