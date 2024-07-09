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
    private readonly recursosRepository: recursosRepository,
    private asesoreservices: asesoresservice,
    private bugRepository: BugRepository
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
      console.log(document)

      if (document.cartype !== '') {
        documents.push(document)
      }
    }

    return await documents
  }

  async karbotcreditsbackup() {
    let credist = await this.CreditRequestRepository.findAll({ _id: ['665ffa3f34a5a10012d843d8', '6660851034a5a10012d86a58', '6660851034a5a10012d86a58', '66620c9ea429820012ab4bf2', '66621bada429820012ab6380', '66625a22a429820012abb3f4', '66628334a429820012abed2a', '6662b9aea429820012ac1e19', '666326b8a429820012ac3e92', '6663f3a33416ab001288afa1', '6664a1a63416ab001288e5bd', '6664a73a3416ab001288e88f', '6664d9cb3416ab001289054f', '666517c13416ab0012893a40', '6665883e3416ab001289691c', '666607623416ab0012899ed3', '666636d33416ab001289c655', '66664ccd3416ab001289e428', '6667104b3416ab00128a307a', '666759013416ab00128a6a9a', '666857e63416ab00128b163c', '666872893416ab00128b2250', '6668a42b3416ab00128b5627', '6668da493416ab00128b7a60', '66691b603416ab00128bb198', '666b1808d069f50012849eec', '666b3056d069f5001284af8d', '666b46d1d069f5001284c8e6', '666b4b1fd069f5001284d5f9', '666baf18ea7f8c0012b611a6', '666e56b3ea7f8c0012b74560', '666f3b35ea7f8c0012b770c5', '666fb0dbea7f8c0012b7d14e', '6670a095ea7f8c0012b83880', '6670a656ea7f8c0012b83d05', '6670f1d0ea7f8c0012b87d1b', '6671c68eea7f8c0012b8ba93', '66728fa5ea7f8c0012b93f15', '6673b07ba1623b0012fc5560', '6673fbcba1623b0012fc6b01', '66746c41a1623b0012fc994d', '667495d2a1623b0012fcaf6c', '6674b0a51e3721001374b7b3', '6674cad61e37210013751a8b', '6674d3a21e37210013751ebd', '667507cd1e372100137534e2', '6675c78da9fcd4001228897f', '6675e2e6a9fcd40012289824'], })


    let karbot = await this.recursosRepository.findAll({ name: 'karbotToken' })
    let token = karbot.items[0].value

    for (let credit of credist.items) {

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

      console.log(payload)


      this.asesoreservices.createLead(payload)
    }
    return 0
  }

  async modulecredits() {

    let list: any = []


    let credist: any = await this.CreditRequestRepository.findAll({ limit: '200', sort: '-createdAt' })

    for (let credit of credist.items) {
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
        GuestInfo: []
      }

      credito.creditInfo = credit

      let user: any = await this.userRepository.findAll({ _id: credit.userId })

      if (credit.userType === 'Guest') {
        credito.GuestInfo = credit.userGuest;
      }

      if (user.items[0]) {
        credito.telefono = user.items[0].phone || ''
        credito.correo = user.items[0].email || ''
        credito.nombre = user.items[0].firstName + ' ' + user.items[0].lastName || ''
        credito.estado = user.items[0].state || ''
      }

      credito.status = credit.status,
        credito.meses = credit.creditMonths,
        credito.pago = credit.downPayment


      if (credit.carType === 'new') {
        let car = await this.NewCarRepository.findOne({ vin: credit.carId })
        if (car) {
          credito.carInfo = car
        }
        else {
          credito.carInfo = ['Carro no encontrado o vendido']
        }
      }
      else {
        let car = await this.UsedCarRepository.findOne({ vin: credit.carId })
        if (car) {
          credito.carInfo = car
        }
        else {
          credito.carInfo = ['Carro no encontrado o vendido']
        }
      }


      list.push(credito)
    }

    return list;
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
    console.log('se inicio el csv imagepro')
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
      console.log(newcar.vin)
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

    // const  csvparse = new Parser();

    // let csv  = csvparse.parse(document);
    return await document
  }
}
