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
        protected readonly repository: asesorsrespository,
        protected readonly config: ConfigService,
        protected readonly s3Service: AwsS3Service
      ) {
        super(repository, 'Asesores', config);
      }


      async create(Asesores: CreateAsesorDTO): Promise<Asesores> {
          return this.repository.create(Asesores)
      }

      async findAll(query: FindAllQuery): Promise<PaginatedEntities<Asesores>> {
        return this.repository.findAll(query);
      }
      async getAsesores(query: FindAllQuery){
 
        let AsesoresList = await this.repository.findAll(query);
      
        return this.filterasesor(AsesoresList);
      }

      filterasesor(asesorlist){
        let today = new Date()
        let asesorenturno = [];
        asesorlist.items.forEach(element => {
          element.dias.forEach(item => {
            if(today > item.hi && today < item.hf){
              asesorenturno.push({ "id": element._id, "asesor": element.nombre});
            }
          });
        });

        return asesorenturno;
      }

}
