import { Parser } from 'json2csv';
import {
  DatabaseException,
  ERROR_CREATING_DOCUMENT,
  ERROR_FINDING_DOCUMENT,
} from 'src/common/models/errors/database.errors';
import { CrudService } from '../../../common/crud/crud.service';
import { CreateAdminDTO } from '../dto/create-admin.dto';
import { Admin } from '../model/admin.model';
import { AdminRepository } from '../repository/admin.repository';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreditRequestRepository } from 'src/entities/creditrequest/repository/creditrequest.repository';
import { NewCarRepository } from 'src/entities/newcar/repository/newcar.repository';
import { UsedCarRepository } from 'src/entities/usedcar/repository/usedcar.repository';
import { UserRepository } from 'src/entities/user/repository/user.repository';
import { AwsS3Service } from '../../../bucket/services/aws-s3/aws-s3.service';
import { UpdateViculoBanner } from '../dto/banner.dto';
import { banners } from '../model/banners.model';
import { bannersrepository } from '../repository/banners.repository';
import { CarRepository } from 'src/entities/finishedcars/repository/finishedcar.repository';
import { recursosRepository } from 'src/entities/recursos/repository/recursos.repository';
import { asesoresservice } from 'src/entities/asesores/service/asesores.service';
import { karbotCreateLead } from 'src/entities/asesores/model/Karbot.response';
import { BugRepository } from 'src/entities/bugs/repository/bitacora.repository';
import { AgencyRepository } from 'src/entities/agency/repository/agency.repository';

import * as csv from 'csv-parser';
import { Readable } from 'stream';

import * as ftp from 'basic-ftp';
import * as fs from 'fs';
import * as path from 'path';
import { Cron, CronExpression } from '@nestjs/schedule';



@Injectable()
export class AdminService extends CrudService<Admin> {

  private client: ftp.Client;
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
    private readonly recursosRepository: recursosRepository,
    private asesoreservices: asesoresservice,
    private bugRepository: BugRepository,
    private agencyRepository: AgencyRepository,
   
    
  ) {
    super(repository, 'Admin', config);
    this.client = new ftp.Client();
    this.client.ftp.verbose = true
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

  async activebanners() {
    return this.bannersrepository.findAll()
  }

  async updateVinculoBanner(body: UpdateViculoBanner) {
    let banners = await this.bannersrepository.findAll({
      banner: body.banner,
    });

    let updates = [];
    for (let banner of banners.items) {
      let b: any = banner;
      let update = await this.bannersrepository.update(b._id, {
        vinculo: body.vinculo,
      });
      updates.push(update);
    }
    return updates;
  }

  async bannelist() {
    let banerslist = await this.bannersrepository.findAll();

    let bannershome = {
      banner: 'home',
      desktopUrl: '',
      movilUrl: '',
      vinculo: '',
    };
    let bannerscarlist = {
      banner: 'carlist',
      desktopUrl: '',
      movilUrl: '',
      vinculo: '',
    };

    for (let banner of banerslist.items) {
      if (banner.type === 'desktop') {
        if (banner.banner === 'home') {
          let desktopUrl = banner.imgurl;
          bannershome.desktopUrl = desktopUrl;
          bannershome.vinculo = banner.vinculo;
        } else if (banner.banner === 'carlist') {
          let desktopUrl = banner.imgurl;
          bannerscarlist.desktopUrl = desktopUrl;
          bannerscarlist.vinculo = banner.vinculo;
        }
      }

      if (banner.type === 'movil') {
        if (banner.banner === 'home') {
          let movilUrl = banner.imgurl;
          bannershome.movilUrl = movilUrl;
          bannershome.vinculo = banner.vinculo;
        } else if (banner.banner === 'carlist') {
          let movilUrl = banner.imgurl;
          bannerscarlist.movilUrl = movilUrl;
          bannerscarlist.vinculo = banner.vinculo;
        }
      }
    }

    return [{ bannershome, bannerscarlist }];
  }


  async bugimgdocument() {
    let bugs = await this.bugRepository.findAll({ type: 'imgError' })

    let documents = []
    for (let bug of bugs.items) {
      let document = {
        type: bug.type,
        error: bug.error,
        cartype: '',
        vin: bug.detalles,
        brand: '',
        model: '',
        series: '',
        agencyCity: '',
        auto_Status_Actual: ''
      }

      let car = await this.NewCarRepository.findAll({ vin: bug.detalles })
      if (car.count > 0) {
        document.cartype = 'new'
        document.brand = car.items[0].brand
        document.model = car.items[0].model
        document.series = car.items[0].series
        document.agencyCity = car.items[0].agencyCity
        document.auto_Status_Actual = car.items[0].status
      }
      else {
        let usedcar = await this.UsedCarRepository.findAll({ vin: bug.detalles })
        if (usedcar.count > 0) {
          document.cartype = 'used'
          document.brand = usedcar.items[0].brand
          document.model = usedcar.items[0].model
          document.series = usedcar.items[0].series
          document.agencyCity = usedcar.items[0].agencyCity
          document.auto_Status_Actual = usedcar.items[0].status
        }
        else {
          let car = await this.CarRepository.findAll({ vin: bug.detalles })
          if (car.count > 0) {
            document.cartype = car.items[0].cartype
            document.brand = car.items[0].brand
            document.model = car.items[0].model
            document.series = car.items[0].series
            document.agencyCity = car.items[0].agencyCity
            document.auto_Status_Actual = 'este auto en algun punto se dejo de recibir informacion'
          }
        }

      }

      if (document.cartype !== '') {
        documents.push(document)
      }
    }

    return await documents
  }


  async imageProVerification(file: Buffer)
  {
    let count = 0
    return new Promise((resolve, reject) => {
      const results:any = []
      const stream = Readable.from(file.toString());
  
      stream.pipe(csv())
      .on('data', async (data) => {results.push(data)
        let car = await this.NewCarRepository.findAll({vin: data.vin})

        if(car.count === 0)
          {
            let usedcar = await this.UsedCarRepository.findAll({vin: data.vin})
            if(usedcar.count === 0)
              {
             
                let carDelete = await this.CarRepository.findAll({vin: data.vin})
                if(carDelete.count === 0)
                  {
                    console.log('no esta en el inventario: ', data.vin)
                  }
                  else
                  {
                    console.log('esta en el inventario, pero a sido eliminado: ', data.vin)
                    count++
                    console.log(count)
                  }

              }
          }

      })
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err))

     
    })
  }

  async karbotcreditsbackup() {

    let start = new Date(2024,8, 11)
    let end = new Date(2024,8, 18)
    let credist = await this.CreditRequestRepository.findAllbyDate(start.toISOString(), end.toISOString())



    let karbot = await this.recursosRepository.findAll({ name: 'karbotToken', sort: '-createdAt'})
    let token = karbot.items[0].value

    for (let credit of credist) {

      let payload: karbotCreateLead = {
        lineName: "Estrenatuauto",
        referenceId: '',
        user_email: '',
        campaign: "promocion",
        categoryLead: '',
        token: token,
        canalLead: 'SITIO WEB',
        phoneNumber: '',
        user_nombre: '',
        user_apellido: '',
        product: '',
        origin: 'Credito',
        vin: '',
      }
      if (credit.userType === 'User') {
        let user = await this.userRepository.findAll({ _id: credit.userId.toString() })

        payload.user_nombre = user.items[0].firstName
        payload.user_apellido = user.items[0].lastName
        payload.phoneNumber = user.items[0].phone
        payload.user_email = user.items[0].email



      }
      else if (credit.userGuest && credit.userGuest.length > 0) {

        let guest: any = credit.userGuest

        payload.user_nombre = guest[0].nombres
        payload.user_apellido = guest[0].apellidos
        payload.phoneNumber = guest[0].telefono
        payload.user_email = guest[0].email

      }

      if (credit.carType.toString() === 'Used') {
        payload.categoryLead = 'ventas seminuevos'
        let car = await this.UsedCarRepository.findAll({ vin: credit.carId })
        if (car.count > 0) {
          payload.vin = car.items[0].vin
          payload.product = car.items[0].brand + ' ' + car.items[0].model + ' ' + car.items[0].year
        }
        else {
          let careliminate = await this.CarRepository.findAll({ vin: credit.carId })


          if (careliminate.count > 0) {
            let carfinal = careliminate.items[0]
            payload.vin = carfinal.vin
            payload.product = carfinal.brand + ' ' + carfinal.model + ' ' + carfinal.year
          }
        }
      }
      else {
        payload.categoryLead = 'ventas nuevos'
        let car = await this.NewCarRepository.findAll({ vin: credit.carId })


        if (car.count > 0) {
          payload.vin = car.items[0].vin
          payload.product = car.items[0].brand + ' ' + car.items[0].model + ' ' + car.items[0].year
        }
        else {
          let careliminate = await this.CarRepository.findAll({ vin: credit.carId })



          if (careliminate.count > 0) {
            payload.vin = careliminate.items[0].vin
            payload.product = careliminate.items[0].brand + ' ' + careliminate.items[0].model + ' ' + careliminate.items[0].year
          }
        }
      }

      this.asesoreservices.createLead(payload)
    }
    return 0
  }

  async modulecredits() {

    let list: any = []

    let credist: any = await this.CreditRequestRepository.findAll({ limit: '300', sort: '-createdAt' })

    for (let credit of credist.items) {
      let credito: any = {
        fecha_de_creacion: '',
        telefono: '',
        correo: '',
        nombre: '',
        status: '',
        karbotStatus: 'enviado',
        meses: '',
        pago: '',
        tipo: '',
        auto_vin: '',
        auto_Marca: '',
        auto_Modelo: '',
        auto_Serie: '',
        auto_Year: '',
        auto_Transmision: '',
        auto_ciudad: '',
        auto_Agencia: '',
        
      }

      let user: any = await this.userRepository.findAll({ _id: credit.userId })

      if (credit.userType === 'Guest') {
        credito.nombre = credit.userGuest[0].nombres + ' ' + credit.userGuest[0].apellidos;
        credito.telefono = credit.userGuest[0].telefono;
        credito.correo = credit.userGuest[0].email;
      }

   

        credito.status = credit.status,
        credito.meses = credit.creditMonths,
        credito.pago = credit.downPayment
        credito.fecha_de_creacion = credit.createdAt.toString('dd/MM/yyyy')


      if (credit.carType === 'new') {
        let car = await this.NewCarRepository.findOne({ vin: credit.carId })
        if (car) {
          credito.tipo = 'Nuevo'
          credito.auto_vin = car.vin
          credito.auto_Marca = car.brand
          credito.auto_Modelo = car.model
          credito.auto_Serie = car.series
          credito.auto_Year = car.year
          credito.auto_Transmision = car.transmision
          credito.auto_ciudad = car.agencyCity
          let agencia = await this.agencyRepository.findOne({ number: car.agencyId })
          credito.auto_Agencia = agencia.name
          credito.auto_ciudad = car.agencyCity
        }
        else {
          credito.tipo = 'Nuevo'
          credito.auto_vin = credit.carId
          credito.auto_Marca = 'Carro no encontrado o vendido'
        }
      }
      else {
        let car = await this.UsedCarRepository.findOne({ vin: credit.carId })
        if (car) {
          credito.tipo = 'Usado'
          credito.auto_vin = car.vin
          credito.auto_Marca = car.brand
          credito.auto_Modelo = car.model
          credito.auto_Serie = car.series
          credito.auto_Year = car.year
          credito.auto_Transmision = car.transmision
          credito.auto_ciudad = car.agencyCity
          let agencia = await this.agencyRepository.findOne({ number: car.agencyId })
          credito.auto_Agencia = agencia.name
          credito.auto_ciudad = car.agencyCity
          
        }
        else {
          credito.tipo = 'Usado'
          credito.auto_vin = credit.carId
          credito.auto_Marca = 'Carro no encontrado o vendido'
        }
      }


      list.push(credito)
    }

    console.log(list)

    const  csvparse = new Parser();
    let csv  = csvparse.parse(list);


    return csv;
  }

  async disablebanners(body: any) {
    let item: any = await this.bannersrepository.findAll({ type: body.type, banner: body.banner })


    return this.bannersrepository.delete(item.items[0]._id);
  }

  async updateBannersForHome(body: any, file: Express.Multer.File) {


    try {
      let s3Url;

      let item: any = await this.bannersrepository.findAll({ type: body.type, banner: body.banner })

      if (body.type === 'desktop') {

        if (body.banner === 'home') {

          s3Url = await this.s3Service.uploadBeners(`img-detalies/home-desktop-banner.jpg`, file.buffer, true)

          let bannersmodels: banners = {

            imgurl: 'https://estrenatuauto-public-assets.s3.amazonaws.com/img-detalies/home-desktop-banner.jpg',
            isactive: body.isactive,
            vinculo: 'https://bit.ly/3R4ddJg',
            type: 'desktop',
            banner: 'home'
          }

          if (body.vinculo) {
            bannersmodels.vinculo = body.vinculo
          }

          if (item.count > 0) {
            return this.bannersrepository.update(item.items[0]._id, bannersmodels)
          }
          else {
            return this.bannersrepository.create(bannersmodels)
          }




        }
        if (body.banner === 'carlist') {
          s3Url = await this.s3Service.uploadBeners(`img-detalies/carlist-desktop-banner.jpg`, file.buffer, true)

          let bannersmodels: banners = {

            imgurl: 'https://estrenatuauto-public-assets.s3.amazonaws.com/img-detalies/carlist-desktop-banner.jpg',
            isactive: body.isactive,
            vinculo: 'https://bit.ly/3R4ddJg',
            type: 'desktop',
            banner: 'carlist',
          };

          if (body.vinculo) {
            bannersmodels.vinculo = body.vinculo
          }

          if (item.count > 0) {
            return this.bannersrepository.update(item.items[0]._id, bannersmodels)
          }
          else {
            return this.bannersrepository.create(bannersmodels)
          }

        }

      }

      if (body.type === 'movil') {

        if (body.banner === 'home') {
          s3Url = await this.s3Service.uploadBeners(`img-detalies/home-movil-banner.jpg`, file.buffer, true)

          let bannersmodels: banners = {

            imgurl: 'https://estrenatuauto-public-assets.s3.amazonaws.com/img-detalies/home-movil-banner.jpg',
            isactive: body.isactive,
            vinculo: 'https://bit.ly/3R4ddJg',
            type: 'movil',
            banner: 'home',
          };

          if (body.vinculo) {
            bannersmodels.vinculo = body.vinculo
          }

          if (item.count > 0) {
            return this.bannersrepository.update(item.items[0]._id, bannersmodels)
          }
          else {
            return this.bannersrepository.create(bannersmodels)
          }

        }
        if (body.banner === 'carlist') {
          s3Url = await this.s3Service.uploadBeners(`img-detalies/carlist-movil-banner.jpg`, file.buffer, true)

          let bannersmodels: banners = {
            imgurl: 'https://estrenatuauto-public-assets.s3.amazonaws.com/img-detalies/carlist-movil-banner.jpg',
            isactive: body.isactive,
            vinculo: 'https://bit.ly/3R4ddJg',
            type: 'movil',
            banner: 'carlist',
          };

          if (body.vinculo) {
            bannersmodels.vinculo = body.vinculo
          }

          if (item.count > 0) {
            return this.bannersrepository.update(item.items[0]._id, bannersmodels)
          }
          else {
            return this.bannersrepository.create(bannersmodels)
          }

        }


      }

      if (body.banner === 'home' && body.vinculo !== '') {
        let banners: any = await this.bannersrepository.findAll({ banner: body.banner })


        for (let banner of banners.items) {
          await this.bannersrepository.update(banner._id, { vinculo: body.vinculo })
        }

        return 'Vinculo actualizado'

      }

      else if (body.banner === 'carlist' && body.vinculo !== '') {
        let banners: any = await this.bannersrepository.findAll({ banner: body.banner })


        for (let banner of banners.items) {
          await this.bannersrepository.update(banner._id, { vinculo: body.vinculo })
        }

        return 'Vinculo actualizado';
      }

    }
    catch (e) {
      return e
    }
  }

  async getmodelsforimagepro() {
    let newcarslist = await this.NewCarRepository.findAll();
    let UsedCarlist = await this.UsedCarRepository.findAll();

    let document: any = [];

    let bmwidlist = ['800', '802', '901', '902', '903', '904', '905', '906', '907']


    for (let newcar of UsedCarlist.items) {

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

      if (bmwidlist.includes(newcar.agencyId)) {
        dealerid = 'gprmercedesbmw'
      }


      let fotos: any = []
      let specs = ''
      for (let foto of newcar.images) {
        fotos.push({ 'dealerid': dealerid, 'vin': newcar.vin, 'photos': foto })
      }

      if (newcar.specs) {
        if (newcar.specs[8]) {
          specs = newcar.specs[8].descriptionSpec;
        }
      }

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

    for (let newcar of newcarslist.items) {

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

      if (bmwidlist.includes(newcar.agencyId)) {
        dealerid = 'gprmercedesbmw'
      }

      let fotos: any = []
      let specs = ''
      for (let foto of newcar.images) {
        fotos.push({ 'dealerid': dealerid, 'vin': newcar.vin, 'photos': foto })
      }

      if (newcar.specs) {
        if (newcar.specs[8]) {
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

  

    try{
      const  csvparse = new Parser();
      let csv  = csvparse.parse(document);

      const csvFilePath = path.join(__dirname, 'testcars.csv');
      fs.writeFileSync(csvFilePath, csv);
      await this.client.access({
        host: 'inventory.dealerimagepro.com',
        user: 'groupo',
        password: 'dy6AYSaDgs@MfBEC',
      })
  
      await this.client.uploadFrom(csvFilePath, '/testcars.csv')
      await this.client.close()

      return await document
    }
    catch(e){
      return e
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async activemidnight() {
      await this.getmodelsforimagepro()
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async activemidday() {
      await this.getmodelsforimagepro()
  }


}
