import { FindAllQuery } from 'src/common/models/dto/query';
import { PaginatedEntities } from 'src/common/models/paginated-entities.model';
import { CrudService } from '../../../common/crud/crud.service';
import { CreateUserDTO } from '../dto/create-user';
import { UpdateUserWishlistDTO } from '../dto/update-user-wishlist.dto';

import { User } from '../model/user.model';
import { UserRepository } from '../repository/user.repository';

import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SelfUserResponse } from '../dto/self-user-response.dto';
import { plainToClass } from 'class-transformer';
import { UpdateUserDocuments } from '../dto/update-user-documents.dto';
import { AwsS3Service } from '../../../bucket/services/aws-s3/aws-s3.service';
import { UsedCarRepository } from 'src/entities/usedcar/repository/usedcar.repository';
import { NewCarRepository } from 'src/entities/newcar/repository/newcar.repository';
import { CreditRequestRepository } from 'src/entities/creditrequest/repository/creditrequest.repository';
import { InsuranceRequestRepository } from 'src/entities/insurancerequests/repository/insurancerequest.repository';
import { carType } from 'src/entities/shared/enums';
import { TestDriveAppointmentRepository } from 'src/entities/testdriveappointments/repository/testdriveappointment.repository';
import { orderRepository } from 'src/entities/order/repository/order.repository';
import { InspectionAppointmentRepository } from 'src/entities/inspectionappointment/repository/inspectionappointment.repository';

@Injectable()
export class UserService extends CrudService<User> {

  constructor(
    readonly repository: UserRepository,
    readonly config: ConfigService,
    readonly s3Service: AwsS3Service,
    private usedcarrepository: UsedCarRepository,
    private newcarrepository: NewCarRepository,
    private creditrepocitory: CreditRequestRepository,
    private insurancerepository: InsuranceRequestRepository,
    private testdriverepository: TestDriveAppointmentRepository,
    private orderrepository: orderRepository,
    private inspesctionrepository: InspectionAppointmentRepository
  ) {
    super(repository, 'User', config);
  }

  async create(user: CreateUserDTO): Promise<User> {
    const exists = await this.findByEmailAndFirebaseId(user.firebaseId, user.email)
    if(exists) throw new BadRequestException('User with given email already exists')
    return this.repository.create(user)
  }

  async findByEmailAndFirebaseId(firebaseId: string, email: string): Promise<User> {
    return this.repository.findOne({firebaseId, email})
  }

  async findAll(query: FindAllQuery): Promise<PaginatedEntities<User>> {
    return this.repository.findAll(query);
  }

  async findByFirebaseid(id: string){

    let allusers = await this.repository.findAll();

    let userModel: any;

    allusers.items.forEach((user) => {
      if(user.firebaseId === id)
      [
        userModel = user
      ]
    })


    return userModel
  }

  async findSelf(userId: string): Promise<SelfUserResponse> {
    const foundUser = await this.repository.findById(userId)
    const dto = plainToClass(SelfUserResponse, foundUser, { excludeExtraneousValues: true })
    dto.fullName = foundUser.getFullName()
    return dto
  }

  async updateWishlist(id: string, body: UpdateUserWishlistDTO) {
    if(body.action === 'add') {
      return this.repository.addToWishlist(id, body.carId, body.carType)
    }
    else if(body.action === 'remove') {
      return this.repository.removeFromWishlist(id, body.carId, body.carType)
    }
    else {
      throw new BadRequestException('Invalid action')
    }
  }

  async updateUserDocuments(id: string, body: UpdateUserDocuments, file: Express.Multer.File) {

    if(!file || !file.buffer) {
      throw new BadRequestException('Invalid file provided')
    }
    const sizeInMb = file.size / 1024 / 1024
    Logger.debug(sizeInMb.toFixed(2), 'receivedFileSize')
    if(sizeInMb > 5) {
      throw new BadRequestException('File exceeds allowed size limit')
    }
    const user = await this.repository.findById(id)

    const s3Url = await this.s3Service.uploadFile(`user-${id}/${file.originalname}`, file.buffer, false)

    Logger.debug(s3Url, 's3Response')

    let currentDocuments = user.documents
    if(!currentDocuments) {
      Logger.debug('no documents in user')
      let newUserDocument = {
          name: body.name,
          url: s3Url
      }
      return this.repository.addUserDocument(id, newUserDocument)
    }
    else {
      const documentIndex = currentDocuments.findIndex(d => d.name === body.name)
      if(documentIndex > -1) {
        Logger.debug('updating existing document')
        let updatedUserDocument = {
          name: body.name,
          url: s3Url
        }
        return this.repository.updateUserDocument(id, updatedUserDocument)
      }
      else {
        Logger.debug('adding new document to existing array')
        let newUserDocument = {
          name: body.name,
          url: s3Url
        }
        return this.repository.addUserDocument(id, newUserDocument)
      }
    }
  }

  async getUserDocument(id: string, documentName: string) {

    const user = await this.repository.findById(id)
    const userDocument = user.documents.find(d => d.name === documentName)
    if(!userDocument) throw new NotFoundException('User does not have requested document')
    const fileNameOnly = userDocument.url.split('amazonaws.com/')[1];
    return { url: await this.s3Service.getSignedDownloadUrl(fileNameOnly) };

  }

  async findMyIntentions(id: string)
  {

    let allintenciones: any = []

    let autosyacomprados: any = []

    // procesamiento de intenciones de compra

   const ordersuserlist = await this.orderrepository.findAll({userId: id})

   for(let order of ordersuserlist.items)
   {
     let car = await this.newcarrepository.findAll({_id: order.carid})

     if(car.count > 0)
     {
      autosyacomprados.push(car.items[0].vin)

      let compra = car.items[0]

      compra.id = order.Norder
      compra.status = order.status
      compra.tipo = 2

      compra.isnewcar = true;

      if(order.concept === 1)
      {
        compra.grupo = 'apartado'
      }
      else
      {
        compra.grupo = 'compra'
      }

      allintenciones.push(compra)
     }
     else
     {
      let usedcar = await this.usedcarrepository.findAll({_id: order.carid})
      autosyacomprados.push(usedcar.items[0].vin)

      let compra = usedcar.items[0]

      compra.Norder = order.Norder
      compra.status = order.status
      compra.tipo = 2
      compra.isnewcar = false;

      if(order.concept === 1)
      {
        compra.grupo = 'apartado'
      }
      else
      {
        compra.grupo = 'compra'
      }
      

      allintenciones.push(compra)
     }

    
   }

   // fin procesamiento de intenciones de compra


   //procesamientos de creditos
   const usercreditlist =  await this.creditrepocitory.findAll({userId: id})
   let repitcreditforusedcar: any = []
   let repitcreditfornewdcar: any = []

   

   for(let credit of usercreditlist.items)
   {

    if(autosyacomprados.includes(credit.carId) ){}
    else 
    {
      if(credit.carType === carType.new )
      {
        if(repitcreditfornewdcar.includes(credit.carId)){}
        else{repitcreditfornewdcar.push(credit.carId)}
      }
      else
      {
        if(repitcreditforusedcar.includes(credit.carId)){}
        else{repitcreditforusedcar.push(credit.carId)}
      }
    }

   }

   //color, modelo, agencia, version, año, status



   for(let car of repitcreditfornewdcar)
   {
    let carverify:any = await this.newcarrepository.findAll({vin: car})

    if(carverify.items[0])
    {
      let numbercarforcaracters = await (await this.newcarrepository.findAll({series: carverify.items[0].series, colours:  carverify.items[0].colours, model: carverify.items[0].model, agencyId: carverify.items[0].agencyId, year: carverify.items[0].year, status: 'online'})).items.length

      let itemresponsemodel = carverify.items[0];

      const usercreditlist:any =  await this.creditrepocitory.findAll({userId: id, carId: car})

      itemresponsemodel.disponibles = numbercarforcaracters;
      itemresponsemodel.status = usercreditlist.items[0].status;
      itemresponsemodel.isnewcar = true;
      itemresponsemodel.tipo = 1
      itemresponsemodel.idintencion = usercreditlist.items[0].id;
      itemresponsemodel.grupo = 'credito'

      allintenciones.push(itemresponsemodel)

    }


   }

   for(let car of repitcreditforusedcar)
   {
    let carverify:any = await this.usedcarrepository.findAll({vin: car})


    if(carverify.items[0])
    {

      let itemresponsemodel = carverify.items[0];

      const usercreditlist:any =  await this.creditrepocitory.findAll({userId: id, carId: car})

      itemresponsemodel.disponibles = 1;

      if(carverify.items[0].status === 'offline')
      {
        itemresponsemodel.disponibles = 0;
      }
      
      itemresponsemodel.status = usercreditlist.items[0].status;
      itemresponsemodel.isnewcar = false;
      itemresponsemodel.tipo = 1
      itemresponsemodel.idintencion = usercreditlist.items[0].id;
      itemresponsemodel.grupo = 'credito'

      allintenciones.push(itemresponsemodel)

    }

   }

   // fin procesamientos de creditos

   // pruebas de manejo

  
    let userDriveTestList = await this.testdriverepository.findAll({userId: id})

    for(let test of userDriveTestList.items)
    {
      if(autosyacomprados.includes(test.carId)){}
      else 
      {
        let isnewcar = await this.newcarrepository.findAll({vin: test.carId})

        if(isnewcar.count > 0)
        {
          let numbercarforcaracters = await (await this.newcarrepository.findAll({series: isnewcar.items[0].series, colours: isnewcar.items[0].colours, model: isnewcar.items[0].model, agencyId: isnewcar.items[0].agencyId, year: isnewcar.items[0].year, status: 'online'})).items.length

          let itemresponsemodel = isnewcar.items[0];
    
          itemresponsemodel.disponibles = numbercarforcaracters;
          itemresponsemodel.status = test.status;
          itemresponsemodel.isnewcar = true;
          itemresponsemodel.tipo = 1
          itemresponsemodel.idintencion = test.id
          itemresponsemodel.grupo = 'prueba de manejo'
    
          allintenciones.push(itemresponsemodel)
        }
        else
        {
        
          let usedcar = await this.usedcarrepository.findAll({vin: test.carId})
          let itemresponsemodel = usedcar.items[0];
    
          itemresponsemodel.disponibles = 1;

          if(usedcar.items[0].status === 'offline')
          {
            itemresponsemodel.disponibles = 0;
          }

          itemresponsemodel.status = test.status;
          itemresponsemodel.isnewcar = false;
          itemresponsemodel.tipo = 1
          itemresponsemodel.idintencion = test.id
          itemresponsemodel.grupo = 'prueba de manejo'
    
          allintenciones.push(itemresponsemodel)
        }
      }
    }

    let misventas = await this.inspesctionrepository.findAll({userId: id})

    return [
      {intenciones: allintenciones},
      {ventas: misventas.items}
   
    ]
  }


  async updateintencion(body: any){

    console.log(body)



  }

}
