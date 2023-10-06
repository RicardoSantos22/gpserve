import { HttpService } from '@nestjs/axios';
import { Body, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CrudService } from '../../../common/crud/crud.service';
import { createHmac } from 'crypto'
import { orderRepository } from '../repository/order.repository'
import { order } from '../model/order.model'
import { NewCarRepository } from 'src/entities/newcar/repository/newcar.repository';
import { UsedCarRepository } from 'src/entities/usedcar/repository/usedcar.repository';

let x;

@Injectable()
export class OrdersService extends CrudService<typeof x>{

    //bbva llave publica
   // private readonly bbvakey: string = '6x8S&74!45m&1=n!!Ffv!#6aQP-i1l8!-=0W!3H1mj3sM8Ty8dpWf45A4)u-#Jm=-(&mqUJt5t-!G7WIH%Wa9m2+o068b4&R(t63m83vH%%xC$LQZ#CQ2$eSUv#TEjTA';

   //bbva llave dev
   private readonly bbvakey: string = 'M94eF#-09dKGeDN9u=-b=j2(4&Xe)f3U9+o134i&0y3(75XsSNE0MO6sEe-M!l)7G1%7(d6v$i#Kp-9sFkVo=&lB1#Pm2OL6kf##=kv7R%K9rLjb#3#+R9I&6E#Kh7B#';

    setupCarsSecret: string

    sadApiConfig = {
        baseUrl: null,
        username: null,
        password: null
    }


    constructor(
        readonly repository: orderRepository,
        readonly config: ConfigService,
        private httpService: HttpService,
        private NewCarRepository: NewCarRepository,
        private usedcarRepository: UsedCarRepository
    ) { 
        super(repository, 'UsedCar', config); 
        this.sadApiConfig = {
            baseUrl: this.config.get('sadAPI.baseUrl'),
            username: this.config.get('sadAPI.username'),
            password: this.config.get('sadAPI.password')
        }
        this.setupCarsSecret = this.config.get('setupCarsSecret')
    }


    async createintencion(body)
    {
        let amount;
        if (body.concept === 1) {
            amount = (body.amount / 100) * 50;
        }
        else if (body.concept === 2) {
            amount = body.amount;
        }

        return amount
    }


    async CreateOrder(body) {

        console.log(body)

        let car: any;

        if(body.typecar === 'true')
        {

            car = await this.NewCarRepository.findById(body.idcar)
            this.NewCarRepository.update(body.idcar, {status: 'offline'})
            
        }
        else
        {
            car = await this.usedcarRepository.findById(body.idcar)
            this.usedcarRepository.update(body.idcar, {status: 'offline'})

        }


        

        let amount;
        if (body.concept === 1) {
            amount = (body.amount / 100) * 50;
        }
        else if (body.concept === 2) {
            amount = body.amount;
        }

        // if(body.concept === 1){
        // amount = this.getminamount(body.amount);
        // }
        // else if(body.concept === 2){
        //     amount = body.amount
        // }

        const N_order = this.CreateRamdomNum();

        const N_referencia = this.CreateRamdomNum();

        const Mensaje: string = (await N_order).toString() + (await N_referencia).toString() + (await amount).toString();

        const hash = createHmac('sha256', this.bbvakey).update(Mensaje).digest('hex');

        let order: order = {
            carid: body.idcar,
            userId: body.userid,
            status: "en proceso",
            Norder: await N_order,
            Nreferencia: await N_referencia,
            amount: await amount,
            concept: body.concept,
            agencyId: body.agencyId,
            hmac: hash,
            commerceName: 'PREMIER AUTOMOTRIZ SA de CV MA',
            method: '',
        }

        // let respuesta = {
        //     "Num_order" : (await N_order).toString(),
        //     "Num_referencia" : (await N_referencia).toString(),
        //     "Hmac" : hash,
        //     "finalamount": (await amount).toString(),
        //     "concept": order.concept,
        //     "idRegister": '1'
        // }
     


       let reponseControl = await this.ReserveZAD(car, 1, body.token)

       console.log(reponseControl)

       let createResponse = await this.repository.create(order);

        return createResponse

    }

    async AddNewOrder(Order) {

        console.log(Order)
        let car; 
        let i;

        let urlreconstruccion = '&norder=' + Order.mp_order + '&agencyId=' + Order.agencyId + '&carId=' + Order.carID + '&brand=' + Order.brand + '&model=' + Order.model + '&series=' + Order.series + '&img=' + Order.img + '&price=' + Order.price + '&year=' + Order.year + '&colorname=' + Order.name + '&transmicion=' + Order.transmicion + '&fuel=' + Order.fuel + '&brandUrl=' + Order.brandUrl + '&modelUrl=' + Order.modelUrl + '&seriesUrl=' + Order.seriesUrl + '&isnewcar=' + Order.isnewcar + '&type=' + Order.type;
        const Mensaje: string = (await Order.mp_order).toString() + (await Order.mp_reference).toString() + (await Order.mp_amount).toString() + (await Order.mp_authorization).toString();

        const hashverificacion = createHmac('sha256', this.bbvakey).update(Mensaje).digest('hex');

        const updateorder = {
            status: "En Verifiacion",
            method: Order.mp_paymentMethod,
            commerceName: Order.mp_commerceName,
        }

        if (Order.mp_signature === hashverificacion) {
            Order.orderDuplicate = 'false'
        }
        else {
            Order.orderDuplicate = 'true'
        }

        if (Order.mp_authorization > 0) {
            

            Order.fronturl = urlreconstruccion

            Order.apiAuthorization = 'Completado'

            let token = await this.getaccesetoken()
            console.log(token)

            if(Order.isnewcar)
            {
                car = await this.NewCarRepository.findById(Order.carID)
            }
            else{

                car = await this.usedcarRepository.findById(Order.carID)
            }

            console.log(updateorder)
            

            // i = this.paymetsZAD(Order, car.vin, token.token)

            let r = await this.repository.update(Order.apiRegister, updateorder)

            console.log(r)

        }
        else {
            Order.apiAuthorization = 'Incompletp'
        }



        return Order;
    }

    async CreateRamdomNum() {
        return Math.round(Math.random() * 999999);
    }

    async getminamount(amount) {
        let finalprice;
        if (amount >= 800000) {

            finalprice = (amount / 100) * 5
            return finalprice;
        }
        else {
            finalprice = 2000;
        }

        return finalprice;

    }

    async conciliacion(userid: string) {

        let allregisters = await this.repository.findAll()

        let listuserregister: any = true;

        allregisters.items.forEach((item: order) => {
            if (item.userId === userid && item.status === "en proceso") {

                listuserregister = [{ "code": 205 }, item]
            }
        })


        return listuserregister;
    }


    private async paymetsZAD(body, vin, token) {


        let hh = new Date();

        let zadbody = {
            agencyID: body.agencyId,
            vehicleSerialNumber: vin,
            vehicleIsNew: body.isnewcar,
            customer: {
                lastName: body.paterno,
                secondLastName: body.materno,
                firstName: body.username,
                phone: body.telefono,
                email: body.email,
                contactMethod: 'whatsapp',
                city: body.estado,
                address: {
                    street: body.calle,
                    noExt: body.num_ext,
                    suburb: body.colonia,
                    postalCode: body.zip
                },
                regimenFiscal: body.regimen_fiscal,
                usoCFDI:body.cfdi,
                RFC: body.rfc,

            },
            sellerID: '1',
            paymentDate: hh,
            paymentAmount: body.mp_amount,
            paymentMethod: 'Credit',
            paymentID: body.mp_order


        }

        const response:any = await this.httpService.post(`http://201.116.249.45:1089/api/Payments`, zadbody ,
        {
            headers: {
                'Authorization': 'Bearer ' + token.trim()
            }
        }).toPromise()
        .then(res => {console.log(res)})
        .catch(e => {console.log(e)})

        
        return 0

    }


    private async ReserveZAD(Reserve, status: number, token) {

        let agencyID: number = parseInt(Reserve.agencyId); 

        


        const response = await this.httpService.post(`http://201.116.249.45:1089/api/Reserves/Vehicles`, {

            agencyID: agencyID,
            vehicleSerialNumber: Reserve.vin,
            reservedStatus: status

        },
        {
            headers: {
                'Authorization': 'Bearer ' + token.trim()
            }
        }).toPromise()



        return  response.data

    }

    async getaccesetoken(){

        const responsetoken = await this.httpService.post(`${this.sadApiConfig.baseUrl}/login/authenticate`, {
            userName: this.sadApiConfig.username,
            password: this.sadApiConfig.password
        }).toPromise()

        return {token: responsetoken.data}
    }


    async conciliacionforDocument(body: any){


        let documentsOrdesList:any = []

        for(let orderitem of body)
        {
            if(orderitem.Estado === 'Dispersado')
            {
                let Norder = parseInt(orderitem.Orden)
                documentsOrdesList.push(Norder)
            }
        }

        console.log(documentsOrdesList)

        let allorders = await this.repository.findAll();

        for(let order of allorders.items)
        {
            if(documentsOrdesList.includes(order.Norder))
            {
              let id = order.id

              this.repository.update(id, {status: 'conciliado'})
            }
        }


    }

}
