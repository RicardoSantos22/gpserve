import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Asesores } from './model/asesores.model'
import { Asesorescontroller } from './controller/asesores.controller'
import { asesoresservice } from './service/asesores.service'
import { asesorsrespository } from './repository/asesores.repository'
import { BucketModule } from '../../bucket/bucket.module';

@Module({
  imports:[TypegooseModule.forFeature([ Asesores ]), BucketModule],
  controllers: [ Asesorescontroller ],
  providers: [asesoresservice, asesorsrespository],
  exports:[ asesoresservice]
})
export class AsesoresModule {}
