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
import { BugRepository } from 'src/entities/bugs/repository/bitacora.repository';
import { recursosRepository } from 'src/entities/recursos/repository/recursos.repository';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class asesoresservice extends CrudService<Asesores> {

  private Karbotdev = 'https://back-staging.karbot.mx/api'
  private karbotProd = 'https://back-production.karbot.mx/api'

    constructor(
        protected readonly repository: asesorsrespository,
        protected readonly recursosRepository: recursosRepository,
        protected readonly config: ConfigService,
        protected readonly s3Service: AwsS3Service,
        private httpservice: HttpService,
        private bugRepository: BugRepository,
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

      async login(){

        let hh = new Date().toLocaleString()
        console.log('Se inicio un login de karbot' + hh)
        try
        {
          const response: any = await this.httpservice.post(this.karbotProd + '/auth/login', {
            email: 'production+estrenatuauto@karlo.io',
            password: '$Bq@x$bFX&mDdED4'

            // email: 'development+estrenatuauto@karlo.io',
            // password: 'AyJB58w7GLA'
          }).toPromise()

          console.log(response.data)

          let karbotstruture: KarbotModel = response.data
          // return ({token: karbotstruture.session.access_token})
          return karbotstruture
        }
        catch(e)
        {
          return 500
        }

      }

      async createLead(payload:karbotCreateLead){ 
        
       try
       {
        let modelKarbotCreateLead = {
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
          customerInterest: payload.product,
          additionalData1: payload.vin,
          }

          this.bugRepository.create({
            type: 'karbot',
            notas: modelKarbotCreateLead,
            error: 'Bitacora',
          })
          
          const reponse: any = await this.httpservice.post(this.karbotProd + '/ws/create-lead-inbound', modelKarbotCreateLead ,
          {
            headers: {
              'Authorization': 'Bearer ' + payload.token
            }
          }).toPromise()

          let dataresponse =  reponse.data
          this.bugRepository.create({
            type: 'karbotResponse',
            notas: dataresponse,
            error: 'Bitacora',
          })

  
            return dataresponse.statusCode
       }
       catch(e)
       {
        this.bugRepository.create({
          detalles: 'error al crear el lead de karbot',
          type: 'bug',
          notas: e.message,
          error: 'karbot',
        })
       }
      }

      async getKarbotTokenForClient(){
        return this.recursosRepository.findAll({name: 'karbotToken'})
      }

      async getKarbotToken(){
        let token:any = await this.login() 

        if(token !== 500)
          {
            this.recursosRepository.create({
              name: 'karbotToken',
              value: token.session.access_token,
              description: 'Token de Karbot',
              date: new Date()
            })
          }
          else{
            this.bugRepository.create({
              type: 'bug',
              notas: "Error al obtener token de Karbot, reinterntar obtener el token lo antes posible",
              error: 'karbot',
            })
          }
      }


      @Cron(CronExpression.EVERY_DAY_AT_10AM)
      async updateRecursos() {
        await this.getKarbotToken()
      }

}
