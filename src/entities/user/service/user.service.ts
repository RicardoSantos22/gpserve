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
import { AgencyRepository } from 'src/entities/agency/repository/agency.repository';
import { String } from 'aws-sdk/clients/batch';
import { InitialAssessmentRepository } from 'src/entities/initialassessment/repository/initial-assessment.repository';

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
    private inspesctionrepository: InspectionAppointmentRepository,
    private agencyrepository: AgencyRepository,
    private initialassessmentsrepository: InitialAssessmentRepository
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


  async sincronizar()
  {
    let credits: any = await this.creditrepocitory.findAll();

    for(let credit of credits.items)
    {
   
      await this.creditrepocitory.update(credit.id, {informativestatus: 'Cotización'})
    }
  }

  async findMyIntentions(id: string)
  {

    

    let tipo1 = ['Cotización', 'Solicitud de Crédito', 'Crédito Autorizado', 'Crédito Rechazado']; 
    let tipo2 = ['Apartado', 'Apartado Offline', 'Enganche Recibido', 'Compra Contado', 'Auto Facturado', 'Preparando Auto']
    let tipo3 = ['Auto en Camino', 'En Agencia', 'Estrenado']

    let allintenciones: any = []

    let autosyacomprados: any = []

    // procesamiento de intenciones de compra

   const ordersuserlist = await this.orderrepository.findAll({userId: id})

   for(let order of ordersuserlist.items)
   {
     let car = await this.newcarrepository.findAll({_id: order.carid})

     if(car.count > 0)
     {  
      let numberDriveTestList: any = (await this.testdriverepository.findAll({userId: id, carId: car.items[0].vin})).items.length
      let numbercredits: any = (await this.creditrepocitory.findAll({userId: id, carId: car.items[0].vin})).items.length

       let agency = await this.agencyrepository.findAll({number: car.items[0].agencyId})

     

      autosyacomprados.push(car.items[0].vin)

      let compra = car.items[0]

   
      compra.ncotizaciones = numbercredits
      compra.npruebas = numberDriveTestList

      compra.Norder  = order.Norder
      compra.intencionid = order.Norder
      compra.status = order.informativestatus
      compra.agencyname = agency.items[0].name;
      compra.agencyID = agency.items[0].number
      compra.tipo = 2
      compra.monto = order.amount
      compra.metodo = 'Transferencia'

      if(order.method === 'TDX')
      {
        compra.metodo = 'Tarjeta'
      }
      else
      {
        compra.metodo = 'Efectivo'
      }


      if(tipo1.includes(order.informativestatus)){compra.tipo = 1}
      if(tipo2.includes(order.informativestatus)){compra.tipo = 2}
      if(tipo3.includes(order.informativestatus)){compra.tipo = 3}


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

      if(usedcar.count > 0)
      {
        autosyacomprados.push(usedcar.items[0].vin)

          
      let numberDriveTestList: any = (await this.testdriverepository.findAll({userId: id, carId: usedcar.items[0].vin})).items.length
      let numbercredits: any = (await this.creditrepocitory.findAll({userId: id, carId: usedcar.items[0].vin})).items.length

        let compra = usedcar.items[0]
  
        let agency = await this.agencyrepository.findAll({number: usedcar.items[0].agencyId})
        compra.agencyname = agency.items[0].name;
        compra.monto = order.amount
        compra.metodo = 'Transferencia'

        if(order.method === 'TDX')
        {
          compra.metodo = 'Tarjeta'
        }
        else
        {
          compra.metodo = 'Efectivo'
        }

        compra.agencyID = agency.items[0].number
        compra.ncotizaciones = numbercredits
        compra.npruebas = numberDriveTestList
        compra.Norder = order.Norder
        compra.intencionid = order.Norder
        compra.status = order.informativestatus
        compra.tipo = 2

        

        if(tipo1.includes(order.informativestatus)){compra.tipo = 1}
        if(tipo2.includes(order.informativestatus)){compra.tipo = 2}
        if(tipo3.includes(order.informativestatus)){compra.tipo = 3}

    
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
      
      let itemresponsemodel: any = carverify.items[0];

      const usercreditlist:any =  await this.creditrepocitory.findAll({userId: id, carId: car})

      let numberDriveTestList: any = (await this.testdriverepository.findAll({userId: id, carId: car})).count

      let agency = await this.agencyrepository.findById(usercreditlist.items[0].agencyId)
      itemresponsemodel.agencyname = agency.name;
      itemresponsemodel.agencyID = agency.number

      itemresponsemodel.disponibles = numbercarforcaracters;
      itemresponsemodel.status = usercreditlist.items[0].informativestatus;
      itemresponsemodel.isnewcar = true;
      itemresponsemodel.tipo = 1

      itemresponsemodel.ncotizaciones = usercreditlist.count
      itemresponsemodel.npruebas = numberDriveTestList
      itemresponsemodel.intencionid = usercreditlist.items[0].id;
      itemresponsemodel.grupo = 'credito'

      allintenciones.push(itemresponsemodel)

    }


   }

   for(let car of repitcreditforusedcar)
   {
    let carverify:any = await this.usedcarrepository.findAll({vin: car})


    if(carverify.items[0])
    {

      let itemresponsemodel: any = carverify.items[0];

      const usercreditlist:any =  await this.creditrepocitory.findAll({userId: id, carId: car})

      let numberDriveTestList: any = (await this.testdriverepository.findAll({userId: id, carId: car})).count

      itemresponsemodel.disponibles = 1;

      if(carverify.items[0].status === 'offline')
      {
        itemresponsemodel.disponibles = 0;
      }

      let agency = await this.agencyrepository.findById(usercreditlist.items[0].agencyId)
      itemresponsemodel.agencyname = agency.name;
      itemresponsemodel.agencyID = agency.number
      
      itemresponsemodel.status = usercreditlist.items[0].informativestatus;
      itemresponsemodel.isnewcar = false;
      itemresponsemodel.tipo = 1
      itemresponsemodel.intencionid = usercreditlist.items[0].id;
      itemresponsemodel.ncotizaciones = usercreditlist.count
      itemresponsemodel.npruebas = numberDriveTestList
      itemresponsemodel.grupo = 'credito'

      allintenciones.push(itemresponsemodel)

    }

   }

   // fin procesamientos de creditos

   // pruebas de manejo

  
    let userDriveTestList: any = await this.testdriverepository.findAll({userId: id})

    for(let test of userDriveTestList.items)
    {
      if(autosyacomprados.includes(test.carId)){}
      else 
      {
        let isnewcar = await this.newcarrepository.findAll({vin: test.carId})

        if(isnewcar.count > 0)
        {

          let numbercarforcaracters = await (await this.newcarrepository.findAll({series: isnewcar.items[0].series, colours: isnewcar.items[0].colours, model: isnewcar.items[0].model, agencyId: isnewcar.items[0].agencyId, year: isnewcar.items[0].year, status: 'online'})).items.length

          let numberDriveTestList: any = (await this.testdriverepository.findAll({userId: id, carId: test.carId})).count
          let numbercredits: any = (await this.creditrepocitory.findAll({userId: id, carId: test.carId})).count
          let itemresponsemodel: any = isnewcar.items[0];

          let agency = await this.agencyrepository.findById(test.agencyId)
          itemresponsemodel.agencyname = agency.name;
          itemresponsemodel.agencyID = agency.number
    
          itemresponsemodel.disponibles = numbercarforcaracters;
          itemresponsemodel.status = test.informativestatus;
          itemresponsemodel.isnewcar = true;
          itemresponsemodel.tipo = 1
          itemresponsemodel.intencionid = test._id
          itemresponsemodel.npruebas = numberDriveTestList
          itemresponsemodel.ncotizaciones = numbercredits
          itemresponsemodel.grupo = 'prueba de manejo'
    
          allintenciones.push(itemresponsemodel)
        }
        else
        {
        
          let usedcar = await this.usedcarrepository.findAll({vin: test.carId})

          let numberDriveTestList: any = (await this.testdriverepository.findAll({userId: id, carId: test.carId})).count
          let numbercredits: any = (await this.creditrepocitory.findAll({userId: id, carId: test.carId})).count
          
 

          let itemresponsemodel: any = usedcar.items[0];
    
          itemresponsemodel.disponibles = 1;
          if(usedcar.items[0].status === 'offline')
          {
            itemresponsemodel.disponibles = 0;
          }

          let agency = await this.agencyrepository.findById(test.agencyId)
          itemresponsemodel.agencyname = agency.name;
          itemresponsemodel.agencyID = agency.number

          itemresponsemodel.status = test.informativestatus;
          itemresponsemodel.isnewcar = false;
          itemresponsemodel.tipo = 1
          itemresponsemodel.intencionid = test._id
          itemresponsemodel.npruebas = numberDriveTestList
          itemresponsemodel.ncotizaciones = numbercredits
          itemresponsemodel.grupo = 'prueba de manejo'
    
          allintenciones.push(itemresponsemodel)
        }
      }
    }

    let misventas = await this.inspesctionrepository.findAll({userId: id})

    let ventaslist = [];

    for(let venta of misventas.items)
    {

      if(venta.initialAssessmentId)
      {
        let ventamodel:any = venta;

        let carinfo = await this.initialassessmentsrepository.findById(venta.initialAssessmentId.toString())

        ventamodel.carInfo = carinfo;

        ventaslist.push(ventamodel)

      }

    }

    return [
      {intenciones: allintenciones},
      {ventas: ventaslist}
   
    ]
  }


  async updateintencion(body: any){


    let orderresponse;

    if(body.intencionid.toString().length === 6)
    {
      orderresponse = body.intencionid
    }
    else
    {
      orderresponse = await this.verifationduplicate(body.intencionid, body.newstatus)
    }

    let numorder = '';

    let type = ''

    if( orderresponse === 500)
    {
      let creditexist = await this.creditrepocitory.findAll({_id: body.intencionid})
      let testexist = await this.testdriverepository.findAll({_id: body.intencionid})

       let norder: any = parseInt(body.intencionid)
      
       let order = await this.orderrepository.findAll({Norder: norder})

        if(order.count  > 0){ type = 'order'}
        else if(testexist.count > 0){ type = 'test'}
        else if(creditexist.count > 0){type = 'credit'}
    }
    else
    {
      type = 'order'

      numorder = orderresponse
    }

    let modelstatus = ['Apartado', 'Apartado Offline', 'Enganche Recibido', 'Compra Contado', 'Auto Facturado', 'Preparando Auto', 'Auto en Camino', 'En Agencia', 'Estrenado']


    if(type === 'credit'){
      
      if(modelstatus.includes(body.newstatus))
      { 

        

        const N_order = this.CreateRamdomNum();

        const N_referencia = this.CreateRamdomNum();

        let credit = await this.creditrepocitory.findById(body.intencionid)
        let agency = await this.agencyrepository.findById(credit.agencyId.toString())

        let carid = ''

        if(credit.carType === carType.new)
        {
          let car = await this.newcarrepository.findAll({vin: credit.carId})

          carid = car.items[0]._id;
        }
        else
        {
          let car = await this.usedcarrepository.findAll({vin: credit.carId})

          carid = car.items[0]._id;
        }

        let concepto1 = ['Apartado', 'Apartado Offline', 'Enganche Recibido']
        let concepto2 = ['Compra Contado', 'Auto Facturado', 'Preparando Auto', 'Auto en Camino', 'En Agencia', 'Estrenado']

        let concepto = 1;

        if(concepto1.includes(body.newstatus))
        {
          concepto = 1
        }
        if(concepto2.includes(body.newstatus))
        {
          concepto = 2
        }

        let order: any = {
          carid: carid,
          userId: credit.userId,
          status: 'en proceso',
          Norder: await N_order,
          Nreferencia: await N_referencia,
          amount: 0,
          concept: concepto,
          agencyId: agency.number,
          hmac: 'sin asignar',
          commerceName: 'PREMIER AUTOMOTRIZ SA de CV MA',
          method: 'Tranferencia',
          informativestatus: body.newstatus
      }

        await this.creditrepocitory.update(body.intencionid, {informativestatus: body.newstatus})
        return await this.orderrepository.create(order)
      }
      else
      {
        return await this.creditrepocitory.update(body.intencionid, {informativestatus: body.newstatus})
      }
   
    
    }
    else if(type === 'test'){ 


      if(modelstatus.includes(body.newstatus))
      {

        const N_order = this.CreateRamdomNum();

        const N_referencia = this.CreateRamdomNum();

        let test = await this.testdriverepository.findById(body.intencionid)
        let agency = await this.agencyrepository.findById(test.agencyId.toString())

        let carid = ''

        let isnewcar = await this.newcarrepository.findAll({vin: test.carId})

        if(isnewcar.count > 0)
        {
          carid = isnewcar.items[0]._id
        }
        else
        {
          let usedcar = await this.usedcarrepository.findAll({vin: test.carId})

          carid = usedcar.items[0]._id;
        }

        let concepto1 = ['Apartado', 'Apartado Offline', 'Enganche Recibido']
        let concepto2 = ['Compra Contado', 'Auto Facturado', 'Preparando Auto', 'Auto en Camino', 'En Agencia', 'Estrenado']

        let concepto = 1;

        if(concepto1.includes(body.newstatus))
        {
          concepto = 1
        }
        if(concepto2.includes(body.newstatus))
        {
          concepto = 2
        }


        let order: any = {
          carid: carid,
          userId: test.userId,
          status: 'en proceso',
          Norder: await N_order,
          Nreferencia: await N_referencia,
          amount: 0,
          concept: concepto,
          agencyId: agency.number,
          hmac: 'sin asignar',
          commerceName: 'PREMIER AUTOMOTRIZ SA de CV MA',
          method: 'Transferencia',
          informativestatus: body.newstatus
      }

        await this.testdriverepository.update(body.intencionid, {informativestatus: body.newstatus}) 
        return await this.orderrepository.create(order)
      }
      else
      {
        return await this.testdriverepository.update(body.intencionid, {informativestatus: body.newstatus}) 
      }
      
    
    }
    else if(type === 'order'){ 

      if(numorder !== '')
      {
        let order = await this.orderrepository.findAll({Norder: numorder})
 
        
        return await this.orderrepository.update(order.items[0]._id, {informativestatus: body.newstatus})
      }
      else
      {
        let norder: any = parseInt(body.intencionid)
      
        let order = await this.orderrepository.findAll({Norder: norder})


        return await this.orderrepository.update(order.items[0]._id, {informativestatus: body.newstatus})
      }
      

  
    
    }
    else 
    {
      return 'intencion no encontrado'
    }

  }

  async CreateRamdomNum() {
    return Math.round(Math.random() * 999999);
}


async verifationduplicate(id: string, newstatus: String) {

  let statusdecline = ['Cotización', 'Solicitud de Crédito', 'Crédito Autorizado', 'Crédito Rechazado']; 


  let creditexist = await this.creditrepocitory.findAll({_id: id})
  let testexist = await this.testdriverepository.findAll({_id: id})



  if(creditexist.count > 0)
  {

    
    if(creditexist.items[0].carType === carType.new)
    {
      let isnewcar = await this.newcarrepository.findAll({vin: creditexist.items[0].carId})

      let order = await this.orderrepository.findAll({userId: creditexist.items[0].userId.toString(), carid: isnewcar.items[0]._id});

      if(order.count > 0)
      {
        if(statusdecline.includes(newstatus))
        {
          await this.orderrepository.delete(order.items[0]._id)

          return 500
        }
        else
        {
          return order.items[0].Norder

        }
      }
      else 
      {
        return 500
      }
    }
    else if(creditexist.items[0].carType === carType.used)
    {
      let usedCar = await this.usedcarrepository.findAll({vin: creditexist.items[0].carId})
      let order = await this.orderrepository.findAll({userId: creditexist.items[0].userId.toString(), usedCar: usedCar.items[0]._id});

      if(order.count > 0)
      {
        

        if(statusdecline.includes(newstatus))
        {
          await this.orderrepository.delete(order.items[0]._id)

          return 500
        }
        else
        {
          return order.items[0].Norder

        }
      }
      else
      {
        return 500

      }
    }
    
  }
  else if(testexist.count > 0 )
  {
    let isnewcar = await this.newcarrepository.findAll({vin: testexist.items[0].carId})

    if(isnewcar.count > 0)
    {
      let order = await this.orderrepository.findAll({userId: testexist.items[0].userId.toString(), carid: isnewcar.items[0]._id});

      console.log(order)

      
      if(order.count > 0)
      {
        
        if(statusdecline.includes(newstatus))
        {
          await this.orderrepository.delete(order.items[0]._id)

          return 500
        }
        else
        {
          return order.items[0].Norder

        }
      }
      else
      {
        return 500

      }
    }
    else
    {
      let usedCar = await this.usedcarrepository.findAll({vin: testexist.items[0].carId})
      let order = await this.orderrepository.findAll({userId: testexist.items[0].userId.toString(), carid: usedCar.items[0]._id});

      if(order.count > 0)
      {
        
        if(statusdecline.includes(newstatus))
        {
          await this.orderrepository.delete(order.items[0]._id)

          return 500
        }
        else
        {
          return order.items[0].Norder

        }
      }
      else
      {
        return 500

      }
    }

  
  }
  else
  {
    return 500
  }

  
}


}
