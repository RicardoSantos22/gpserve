import { Module } from '@nestjs/common';
import { BugsService } from './service/bugs.service';
import { BugsController } from './controller/bugs.controller';
import { BugRepository } from './repository/bitacora.repository';
import { ScheduleModule } from '@nestjs/schedule';
import { TypegooseModule } from 'nestjs-typegoose';
import {Bug} from './model/bugs.model';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypegooseModule.forFeature([Bug])],
  controllers: [BugsController],
  providers: [BugsService, BugRepository],
  exports: [BugRepository]
})
export class BugsModule {}
