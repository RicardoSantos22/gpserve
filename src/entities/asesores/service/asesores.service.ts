import { Injectable } from '@nestjs/common';
import { FindAllQuery } from 'src/common/models/dto/query';
import { PaginatedEntities } from 'src/common/models/paginated-entities.model';
import { CreateAsesorDTO } from '../dto/create_asesor'
import { asesorsrespository } from '../repository/asesores.repository'
import { Asesores } from '../model/asesores.model'
import { CrudService } from '../../../common/crud/crud.service';
import { ConfigService } from '@nestjs/config';
import { AwsS3Service } from '../../../bucket/services/aws-s3/aws-s3.service';
import { HttpService } from '@nestjs/axios';
import { KarbotModel, CreateLeadModel, karbotCreateLead} from '../model/Karbot.response';
import { authenticate, authorize } from 'passport';
import { promises } from 'dns';

@Injectable()
export class asesoresservice extends CrudService<Asesores> {

  private Karbotdev = 'https://back-staging.karbot.mx/api'
  private karbotProd = 'https://back.karbot.mx/api'

    constructor(
        protected readonly repository: asesorsrespository,
        protected readonly config: ConfigService,
        protected readonly s3Service: AwsS3Service,
        private httpservice: HttpService
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

      async createLead(payload:karbotCreateLead){
        
       try
       {
     
          const reponse: any = await this.httpservice.post(this.Karbotdev + '/ws/create-lead-inbound', {
          lineName: "Estrenatuauto",
          referenceId: (Math.floor(Math.random() * (100 - 1 + 1)) + 1).toString(),
          categoryLead: payload.categoryLead,
          canalLead: payload.canalLead,
          origin: "solicitud " + payload.origin,
          campaign: "promocion",
          phoneNumber: payload.phoneNumber,
          email: payload.user_email,
          generalData: {
            nombre: payload.user_nombre,
            apellido: payload.user_apellido
          },
          customerInterest: payload.product
          },
          {
            headers: {
              'Authorization': 'Bearer ' + payload.token.trim()
            }
          }).toPromise()


          return await reponse.data
        
       }
       catch(e)
       {
        console.log(e)
        return 500
       }

        

        return 
      }

      async login(){

        try
        {
          const response: any = await this.httpservice.post(this.Karbotdev + '/auth/login', {
            email: 'development+estrenatuauto@karlo.io',
            password: 'AyJB58w7GLA'
          }).toPromise()

          let karbotstruture: KarbotModel = response.data

        
          return karbotstruture.session.access_token
        }
        catch(e)
        {
          console.error(e)

          return 500
        }

      }

}
