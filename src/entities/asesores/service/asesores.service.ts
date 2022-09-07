import { Injectable } from '@nestjs/common';
import { FindAllQuery } from 'src/common/models/dto/query';
import { PaginatedEntities } from 'src/common/models/paginated-entities.model';
import { CreateAsesorDTO } from '../dto/create_asesor'
import { asesorsrespository } from '../repository/asesores.repository'
import { Asesores } from '../model/asesores.model'
import { CrudService } from '../../../common/crud/crud.service';

import { ConfigService } from '@nestjs/config';
import { AwsS3Service } from '../../../bucket/services/aws-s3/aws-s3.service';

@Injectable()
export class asesoresservice extends CrudService<Asesores> {

    constructor(
        readonly repository: asesorsrespository,
        readonly config: ConfigService,
        readonly s3Service: AwsS3Service
      ) {
        super(repository, 'Asesores', config);
      }


      async create(Asesores: CreateAsesorDTO): Promise<Asesores> {
          return this.repository.create(Asesores)
      }

      async findAll(query: FindAllQuery): Promise<PaginatedEntities<Asesores>> {
        return this.repository.findAll(query);
      }

      async getasesores(query: FindAllQuery): Promise<PaginatedEntities<Asesores>> {
        let today = new Date();
        let AsesoresList: any = [];

        await this.repository.findAll(query)
        .then((response) => {
          let data:any = response.items;
            data.forEach(element => {
              element.dias.forEach(item => {
                if(today > item.hi && today < item.hf){
                  AsesoresList.push({"id": element._id, "asesor": element.nombre})
                }
              });
          });
        })
        return AsesoresList;
      }

}
