import { Module } from '@nestjs/common';
import { RecursosService } from './service/recursos.service';
import { recursosRepository } from './repository/recursos.repository'; 
import { RecursosController } from './controller/recursos.controller';
import { recurso } from './model/resursos.model';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [TypegooseModule.forFeature([recurso]),],
  controllers: [RecursosController],
  providers: [RecursosService, recursosRepository],
  exports: [RecursosService, recursosRepository],
})
export class RecursosModule {}
