import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Asesores } from './model/asesores.model'
import { asesorescontroller } from './controller/asesores.controller'
import { asesoresservice } from './service/asesores.service'
import { asesorsrespository } from './repository/asesores.repository'
import { BucketModule } from '../../bucket/bucket.module';

@Module({
  imports:[TypegooseModule.forFeature([ Asesores ]), BucketModule],
  controllers: [ asesorescontroller ],
  providers: [asesoresservice, asesorsrespository],
  exports:[ asesoresservice]
})
export class AsesoresModule {}
