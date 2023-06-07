import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
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
    private readonly bbvakey: string = '6x8S&74!45m&1=n!!Ffv!#6aQP-i1l8!-=0W!3H1mj3sM8Ty8dpWf45A4)u-#Jm=-(&mqUJt5t-!G7WIH%Wa9m2+o068b4&R(t63m83vH%%xC$LQZ#CQ2$eSUv#TEjTA';


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


    async CreateOrder(body) {

        console.log(body)

        let car: any;

        if(body.typecar === 'true')
        {

            car = await this.NewCarRepository.findById(body.idcar)
            
        }
        else
        {
            car = await this.usedcarRepository.findById(body.idcar)
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
            hmac: hash
        }

        // let respuesta = {
        //     "Num_order" : (await N_order).toString(),
        //     "Num_referencia" : (await N_referencia).toString(),
        //     "Hmac" : hash,
        //     "finalamount": (await amount).toString(),
        //     "concept": order.concept,
        //     "idRegister": '1'
        // }
        const responsetoken = await this.httpService.post(`${this.sadApiConfig.baseUrl}/login/authenticate`, {
            userName: this.sadApiConfig.username,
            password: this.sadApiConfig.password
        }).toPromise()

        console.log(responsetoken.data)


       let reponseControl = await this.ReserveZAD(car, 1, responsetoken.data)


        return await this.repository.create(order)


    }

    async AddNewOrder(Order) {

        const responsetoken = await this.httpService.post(`${this.sadApiConfig.baseUrl}/login/authenticate`, {
            userName: this.sadApiConfig.username,
            password: this.sadApiConfig.password
        }).toPromise()

        console.log(Order)

        let urlreconstruccion = '&agencyId=' + Order.agencyId + '&carId=' + Order.carID + '&brand=' + Order.brand + '&model=' + Order.model + '&series=' + Order.series + '&img=' + Order.img + '&price=' + Order.price + '&year=' + Order.year + '&colorname=' + Order.name + '&transmicion=' + Order.transmicion + '&fuel=' + Order.fuel + '&brandUrl=' + Order.brandUrl + '&modelUrl=' + Order.modelUrl + '&seriesUrl=' + Order.seriesUrl + '&isnewcar=' + Order.isnewcar + '&type=' + Order.type;
        const Mensaje: string = (await Order.mp_order).toString() + (await Order.mp_reference).toString() + (await Order.mp_amount).toString() + (await Order.mp_authorization).toString();

        const hashverificacion = createHmac('sha256', this.bbvakey).update(Mensaje).digest('hex');

        let updateorder = {
            status: "En Verifiacion"
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
            let car = await this.NewCarRepository.findById(Order.carID)

            this.paymetsZAD(Order, car.vin, responsetoken.data)

            this.repository.update(Order.apiRegister, updateorder)


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

        const response = await this.httpService.post(`http://201.116.249.45:1089/api/Payments`, {
            agencyID: body.agencyId,
            vehicleSerialNumber: vin,
            vehicleIsNew: body.isnewcar,
            customer: {
                lastName: 'santos',
                secondLastName: 'kumul',
                firstName: 'ricardo',
                phone: "9988307729",
                email: 'ricardo@kalyptio.com',
                contactMethod: 'whatsapp',
                city: 'Benito Juarez',
                address: {
                    street: '12',
                    noExt: '12',
                    noInt: '12',
                    suburb: '12',
                    postalCode: '77517'
                },
                regimenFiscal: "601",
                usoCFDI:'p01',
                RFC: 'XAXX010101000',

            },
            sellerID: '1',
            paymentDate: hh,
            paymentAmount: body.mp_amount,
            paymentMethod: 'Credit',
            paymentID: '675179'


        },
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
        .then(res => {console.log(res)})
        .catch(e => {console.log(e)})


        console.log(response)

        return 0

    }

    private getaccesetoken(){
        
    }


    private disponibilidad(){

    }

}
