import { Injectable, Logger } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { CrudRepository } from '../../../common/crud/crud.repository';

import { Asesores } from '../model/asesores.model'


@Injectable()
export class asesorsrespository extends CrudRepository<Asesores>{

    constructor(@InjectModel(Asesores) readonly model: ReturnModelType<typeof Asesores>) {
        super(model, 'Asesores');
    }

    async getallasesores(): Promise<Asesores[]>{
        return this.model.find();
    }
}