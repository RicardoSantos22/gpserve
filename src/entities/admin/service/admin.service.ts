import {
  DatabaseException,
  ERROR_CREATING_DOCUMENT,
  ERROR_FINDING_DOCUMENT,
} from 'src/common/models/errors/database.errors';
import { CrudService } from '../../../common/crud/crud.service';
import { Admin } from '../model/admin.model';
import { AdminRepository } from '../repository/admin.repository';
import { CreateAdminDTO } from '../dto/create-admin.dto';
import { Parser } from 'json2csv';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AwsS3Service } from '../../../bucket/services/aws-s3/aws-s3.service';
import { banners } from '../model/banners.model';
import { bannersrepository } from '../repository/banners.repository';
import { NewCarRepository } from 'src/entities/newcar/repository/newcar.repository';
import { UsedCarRepository } from 'src/entities/usedcar/repository/usedcar.repository';
import { CreditRequestRepository } from 'src/entities/creditrequest/repository/creditrequest.repository';
import { UserRepository } from 'src/entities/user/repository/user.repository';
import { CarRepository } from 'src/entities/finishedcars/repository/finishedcar.repository';
import { recursosRepository } from 'src/entities/recursos/repository/recursos.repository';



@Injectable()
export class AdminService extends CrudService<Admin> {

  constructor(
    readonly repository: AdminRepository,
    readonly config: ConfigService,
    readonly s3Service: AwsS3Service,
    readonly bannersrepository: bannersrepository,
    private readonly NewCarRepository: NewCarRepository,
    private readonly UsedCarRepository: UsedCarRepository,
    private readonly CreditRequestRepository: CreditRequestRepository,
    private readonly userRepository: UserRepository,
    private readonly CarRepository: CarRepository,
    private readonly recursosRepository: recursosRepository
  ) {
    super(repository, 'Admin', config);
  }

  async findAdminByEmail(email: string): Promise<any> {
    const admin = await this.repository.findOne({ email });

   
    if (!admin) {
      throw new NotFoundException(ERROR_FINDING_DOCUMENT('Admin'));
    }
    return admin;
  }

  

  async create(dto: CreateAdminDTO): Promise<Admin> {
    try {
      const adminValidator = await this.repository.findOne({
        email: dto.email,
      });
      if (adminValidator) {
        throw new BadRequestException('This email already exists');
      }
      const admin = await this.repository.create(dto);
      return admin;
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      throw new DatabaseException(
        ERROR_CREATING_DOCUMENT(this.name, e.message || e),
      );
    }
  }

  async activebanners()
  {
    return this.bannersrepository.findAll()
  }

  async bannelist()
  {
    let banerslist = await this.bannersrepository.findAll()


    let bannershome = {banner: 'home', desktopUrl: '', movilUrl: '' }
    let bannerscarlist = {banner: 'carlist', desktopUrl: '', movilUrl: ''}

    for(let banner of banerslist.items)
    {

      if(banner.type === 'desktop')
      {
        if(banner.banner === 'home')
        {
          let desktopUrl = banner.imgurl

          bannershome.desktopUrl = desktopUrl
        }
        else if(banner.banner === 'carlist')
        {
          let desktopUrl = banner.imgurl
          bannerscarlist.desktopUrl = desktopUrl
        }


      }

      if(banner.type === 'movil')
      {
        if(banner.banner === 'home')
        {
          let movilUrl = banner.imgurl
          bannershome.movilUrl = movilUrl
        }
        else if(banner.banner === 'carlist')
        {
          let movilUrl = banner.imgurl
          bannerscarlist.movilUrl = movilUrl
        }
      }
      

    }

    return [{bannershome, bannerscarlist}]



    
  }

  async karbotcreditsbackup(){
    let credist = await this.CreditRequestRepository.findAll({_id: ['66608be534a5a10012d86e7f'], })
    console.log(credist)
  

    let karbot = await this.recursosRepository.findAll({name: 'karbotToken'})
    console.log(karbot)

    let token = karbot.items[0].value
    
    for(let credit of credist.items)
      {

        let payload = {
          categoryLead: '',
          token: token,
          canalLead: 'SITIO WEB',
          phoneNumber: '',
          user_nombre: '',
          user_apellido: '',
          product: '', 
          origin: 'Credito',
          vin: '',
          additionalData1: '',
        }  
        if(credit.userType === 'User')
          {
            let user = await this.userRepository.findAll({_id: credit.userId.toString()})

            payload.user_nombre = user.items[0].firstName
            payload.user_apellido = user.items[0].lastName
            payload.phoneNumber = user.items[0].phone

            if(credit.carType.toString() === 'Used')
              {
                payload.categoryLead = 'ventas seminuevos'
                 let car = await this.UsedCarRepository.findAll({vin: credit.carId})
                 if(car.count > 0)
                  {
                    payload.vin = car.items[0].vin
                    payload.product = car.items[0].brand + ' ' + car.items[0].model + ' ' + car.items[0].year
                  }
                  else
                  {
                    let careliminate = await this.CarRepository.findAll({vin: credit.carId})
                 

                    if(careliminate.count > 0)
                      {
                        let carfinal = careliminate.items[0]
                        payload.vin = carfinal.vin
                        payload.product = carfinal.brand + ' ' + carfinal.model + ' ' + carfinal.year
                      }
                  }
              }
              else
              {
                payload.categoryLead = 'ventas nuevos'
                let car = await this.NewCarRepository.findAll({vin: credit.carId})
                

              }
              
          }
          else 
          {

            payload.categoryLead = 'ventas nuevos'

          }

          console.log(payload)
      }
    return 0
  }

  async modulecredits(){

    let list: any= []


        let credist:any = await this.CreditRequestRepository.findAll({limit: '200', sort: '-createdAt'})

    for(let credit of credist.items)
      {
        let credito: any = {
          telefono: '', 
          correo: '',
          nombre: '',
          estado: '',
          status: '',
          karbotStatus: 'enviado',
          meses: '',
          pago: '',
          creditInfo: [],
          carInfo: [],
          GuestInfo:[]
        }

        credito.creditInfo = credit

        let user:any = await this.userRepository.findAll({_id: credit.userId})

        if(credit.userType === 'Guest')
          {
            credito.GuestInfo = credit.userGuest;
          }
  
        if(user.items[0])
          {
            credito.telefono = user.items[0].phone || ''
            credito.correo = user.items[0].email || ''
            credito.nombre = user.items[0].firstName+ ' ' + user.items[0].lastName || ''
            credito.estado = user.items[0].state || ''
          }

        credito.status = credit.status,
        credito.meses = credit.creditMonths,
        credito.pago = credit.downPayment


        if(credit.carType === 'new')
        {
          let car = await this.NewCarRepository.findOne({vin: credit.carId})
          if(car)
            {
              credito.carInfo = car
            }
            else 
            {
              credito.carInfo = ['Carro no encontrado o vendido']
            }
        }
        else{
          let car = await this.UsedCarRepository.findOne({vin: credit.carId})
          if(car)
            {
              credito.carInfo = car
            }
            else 
            {
              credito.carInfo = ['Carro no encontrado o vendido']
            }
        }   


        list.push(credito)
      }

    return list

  }

  async disablebanners( body: any){
    let item:any = await this.bannersrepository.findAll({type:body.type , banner: body.banner}) 


    return this.bannersrepository.delete(item.items[0]._id)
  }

  async updateBannersForHome( body: any, file: Express.Multer.File){


    try
    {
      let s3Url;

      let item:any = await this.bannersrepository.findAll({type:body.type , banner: body.banner}) 

      if(body.type === 'desktop')
      { 
  
        if(body.banner === 'home')
        {
  
            s3Url = await this.s3Service.uploadBeners(`img-detalies/home-desktop-banner.jpg`, file.buffer, true)

            let bannersmodels : banners = {
            
              imgurl: 'https://estrenatuauto-public-assets.s3.amazonaws.com/img-detalies/home-desktop-banner.jpg',
              isactive: body.isactive,
              vinculo: 'https://bit.ly/3R4ddJg',
              type: 'desktop',
              banner: 'home'
            }

            if(body.vinculo)
            {
              bannersmodels.vinculo = body.vinculo
            }

            if(item.count > 0)
            {
              return this.bannersrepository.update(item.items[0]._id ,bannersmodels)
            }
            else
            {
              return this.bannersrepository.create(bannersmodels)
            }
            

           
          
        }
        if(body.banner === 'carlist')
        {
           s3Url = await this.s3Service.uploadBeners(`img-detalies/carlist-desktop-banner.jpg`, file.buffer, true)

           let bannersmodels : banners = {
            
            imgurl: 'https://estrenatuauto-public-assets.s3.amazonaws.com/img-detalies/carlist-desktop-banner.jpg',
            isactive: body.isactive,
            vinculo: 'https://bit.ly/3R4ddJg',
            type: 'desktop',
            banner: 'carlist'
          }

          if(body.vinculo)
          {
            bannersmodels.vinculo = body.vinculo
          }


          if(item.count > 0)
          {
            return this.bannersrepository.update(item.items[0]._id ,bannersmodels)
          }
          else
          {
            return this.bannersrepository.create(bannersmodels)
          }
          
        }
       
      }
  
      if(body.type === 'movil')
      { 
  
        if(body.banner === 'home')
        {
           s3Url = await this.s3Service.uploadBeners(`img-detalies/home-movil-banner.jpg`, file.buffer, true)

           let bannersmodels : banners = {
            
            imgurl: 'https://estrenatuauto-public-assets.s3.amazonaws.com/img-detalies/home-movil-banner.jpg',
            isactive: body.isactive,
            vinculo: 'https://bit.ly/3R4ddJg',
            type: 'movil',
            banner: 'home'
          }

          if(body.vinculo)
          {
            bannersmodels.vinculo = body.vinculo
          }


          if(item.count > 0)
          {
            return this.bannersrepository.update(item.items[0]._id ,bannersmodels)
          }
          else
          {
            return this.bannersrepository.create(bannersmodels)
          }
          
        }
        if(body.banner === 'carlist')
        {
           s3Url = await this.s3Service.uploadBeners(`img-detalies/carlist-movil-banner.jpg`, file.buffer, true)

           let bannersmodels : banners = {
            imgurl: 'https://estrenatuauto-public-assets.s3.amazonaws.com/img-detalies/carlist-movil-banner.jpg',
            isactive: body.isactive,
            vinculo: 'https://bit.ly/3R4ddJg',
            type: 'movil',
            banner: 'carlist'
          }

          if(body.vinculo)
          {
            bannersmodels.vinculo = body.vinculo
          }


          if(item.count > 0)
          {
            return this.bannersrepository.update(item.items[0]._id ,bannersmodels)
          }
          else
          {
            return this.bannersrepository.create(bannersmodels)
          }
          
        }
       
        
      }

      if(body.banner === 'home' && body.vinculo !== '')
      {
        let banners:any = await this.bannersrepository.findAll({banner: body.banner}) 
       

        for(let banner of banners.items)
        {
         await this.bannersrepository.update(banner._id ,{vinculo: body.vinculo})
        }

        return 'Vinculo actualizado'
        
      }
  
      else if(body.banner === 'carlist' && body.vinculo !== '')
      {
        let banners:any = await this.bannersrepository.findAll({banner: body.banner}) 
       

        for(let banner of banners.items)
        {
         await this.bannersrepository.update(banner._id ,{vinculo: body.vinculo})
        }

        return 'Vinculo actualizado'
      }

    }
    catch(e)
    {
      return e
    }

  }


  async getmodelsforimagepro()
  {
    console.log('se inicio el csv imagepro')
    let newcarslist = await this.NewCarRepository.findAll();
    let UsedCarlist = await this.UsedCarRepository.findAll();
    
    let document: any = [];

    let bmwidlist = ['800', '802','901', '902', '903', '904', '905', '906', '907']


    for(let newcar of UsedCarlist.items)
      {

        let modelimagepro = {
          'dealerid': '',
          'inventorydi': '', 
          'vin': '',
          'type': '',
          'year': '',
          'make': '',
          'model': '',
          'cartype': '',
          'body': '',
          'transmission': '',
          'trim': '',
          'doorcount': '',
          'enginecylinder': '',
          'enginedisplacement': '',
          'drivetrain': '',
          'extcolor': '',
          'intcolor': '',
          'price': '',
          'msrp': '',
          'features': '',
          'inventorysdate': '',
          'photos': []
        }

        let dealerid = 'grupocdj'

        if(bmwidlist.includes(newcar.agencyId))
          {
            dealerid = 'gprmercedesbmw'
          }


        let fotos: any = []
        let specs = ''
        for(let foto of newcar.images)
          {
            fotos.push({'dealerid': dealerid, 'vin': newcar.vin,'photos': foto })
          }

          if(newcar.specs)
            {
              if(newcar.specs[8])
                {
                  specs = newcar.specs[8].descriptionSpec;
                }
            }

            console.log(newcar.vin)

        modelimagepro.cartype = 'used'
        modelimagepro.dealerid = dealerid
        modelimagepro.inventorydi = newcar._id
        modelimagepro.vin = newcar.vin
        modelimagepro.year = newcar.year
        modelimagepro.make = newcar.brand
        modelimagepro.model = newcar.model
        modelimagepro.body = newcar.series
        modelimagepro.type = newcar.chassisType
        modelimagepro.transmission = newcar.transmission
        modelimagepro.enginedisplacement = specs
        modelimagepro.extcolor = newcar.colours
        modelimagepro.intcolor = newcar.baseColour
        modelimagepro.price = newcar.price
        modelimagepro.photos = fotos
        modelimagepro.inventorysdate = new Date(newcar.createdAt).toLocaleString() 
        document.push(modelimagepro)

      }

      for(let newcar of newcarslist.items)
        {
  
          let modelimagepro = {
            'dealerid': '',
          'inventorydi': '', 
            'vin': '',
            'type': '',
            'year': '',
            'make': '',
            'model': '',
            'cartype': '',
            'body': '',
            'transmission': '',
            'trim': '',
            'doorcount': '',
            'enginecylinder': '',
            'enginedisplacement': '',
            'drivetrain': '',
            'extcolor': '',
            'intcolor': '',
            'price': '',
            'msrp': '',
            'features': '',
            'inventorysdate': '',
            'photos': []
          }
          console.log(newcar.vin)
          let dealerid = 'grupocdj'

          if(bmwidlist.includes(newcar.agencyId))
            {
              dealerid = 'gprmercedesbmw'
            }

          let fotos: any = []
          let specs = ''
          for(let foto of newcar.images)
            {
              fotos.push({'dealerid': dealerid, 'vin': newcar.vin,'photos': foto })
            }
  
            if(newcar.specs)
              {
                if(newcar.specs[8])
                  {
                    specs = newcar.specs[8].descriptionSpec;
                  }
              }
         
          modelimagepro.cartype = 'new'
          modelimagepro.dealerid = dealerid
          modelimagepro.inventorydi = newcar._id, 
  
          modelimagepro.vin = newcar.vin
          modelimagepro.year = newcar.year
          modelimagepro.make = newcar.brand
          modelimagepro.model = newcar.model
          modelimagepro.body = newcar.series
          modelimagepro.type = newcar.chassisType
          modelimagepro.transmission = newcar.transmission
          modelimagepro.enginedisplacement = specs
          modelimagepro.extcolor = newcar.colours
          modelimagepro.intcolor = newcar.baseColour
          modelimagepro.price = newcar.price
          modelimagepro.photos = fotos
          modelimagepro.inventorysdate = new Date(newcar.createdAt).toLocaleString()  
          document.push(modelimagepro)
  
        }

        // const  csvparse = new Parser();

        // let csv  = csvparse.parse(document);
      return await document
  }
}
