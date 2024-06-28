import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Asesores } from './model/asesores.model'
import { Asesorescontroller } from './controller/asesores.controller'
import { asesoresservice } from './service/asesores.service'
import { asesorsrespository } from './repository/asesores.repository'
import { BucketModule } from '../../bucket/bucket.module';
import { HttpModule } from '@nestjs/axios';
import { BugsModule } from '../bugs/bugs.module';
import { RecursosModule } from '../recursos/recursos.module';



@Module({
  imports:[TypegooseModule.forFeature([ Asesores ]), BucketModule, HttpModule.register({}),BugsModule, RecursosModule ],
  controllers: [ Asesorescontroller ],
  providers: [asesoresservice, asesorsrespository],
  exports:[ asesoresservice, asesorsrespository,]
})
export class AsesoresModule {}
