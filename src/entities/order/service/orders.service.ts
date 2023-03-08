import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CrudService } from '../../../common/crud/crud.service';
import { createHmac } from 'crypto'
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { orderRepository } from '../repository/order.repository'
import { order } from '../model/order.model'

let x;

@WebSocketGateway({cors: ['*']}, )

@Injectable()
export class OrdersService extends CrudService<typeof x>{
    private readonly bbvakey: string = '6x8S&74!45m&1=n!!Ffv!#6aQP-i1l8!-=0W!3H1mj3sM8Ty8dpWf45A4)u-#Jm=-(&mqUJt5t-!G7WIH%Wa9m2+o068b4&R(t63m83vH%%xC$LQZ#CQ2$eSUv#TEjTA';


    constructor(
        readonly repository: orderRepository,
        readonly config: ConfigService,
        ){super(repository, 'UsedCar', config);}

    @WebSocketServer() server: Server;

    afterInit(server:any){
        console.log("sockets activos")
    }
    handleConnection( client: any, ...args: any[]){
        console.log("alguien inicio una compra")

    }

    async CreateOrder(body){
        
        let amount;
        if(body.concept === 1){
        amount = this.getminamount(body.amount);
        }
        else if(body.concept === 2){
            amount = body.amount
        }

        
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
        

        return await this.repository.create(order)

    
    }

    async AddNewOrder(Order){

        console.log(Order)

        let urlreconstruccion = '&agencyId='+ Order.agencyId + '&carId=' + Order.carID + '&brand='+ Order.brand + '&model=' + Order.model + '&series=' + Order.series + '&img=' + Order.img + '&price=' + Order.price + '&year=' + Order.year + '&colorname=' + Order.name + '&transmicion=' + Order.transmicion + '&fuel=' + Order.fuel + '&brandUrl=' + Order.brandUrl + '&modelUrl=' + Order.modelUrl + '&seriesUrl=' + Order.seriesUrl + '&isnewcar=' + Order.isnewcar + '&type=' + Order.type;
        const Mensaje: string = (await Order.mp_order).toString() + (await Order.mp_reference).toString() + (await Order.mp_amount).toString() + (await Order.mp_authorization).toString(); 

        const hashverificacion = createHmac('sha256', this.bbvakey).update(Mensaje).digest('hex');

        let updateorder = {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
            status: "En Verifiacion"
        }

        if(Order.mp_signature === hashverificacion){
            Order.orderDuplicate = 'false'
        }
        else{
            Order.orderDuplicate = 'true'
        }

        if(Order.mp_authorization > 0){

            Order.fronturl = urlreconstruccion

            Order.apiAuthorization = 'Completado'
      
         this.repository.update(Order.apiRegister, updateorder)
             

        }
        else{
            Order.apiAuthorization = 'Incompletp' 
        }

        
        this.handleIncomingMessage(Order);



        return Order;
    }

    async CreateRamdomNum(){
        return Math.round(Math.random() * 999999);
    }

    async getminamount(amount){
        let finalprice;
        if(amount >= 800000){

            finalprice = (amount / 100 ) * 5
            return finalprice;
        }
        else {
            finalprice = 2000;
        }

        return finalprice;

    }

   async conciliacion(userid: string){

        let allregisters = await this.repository.findAll()

        let listuserregister: any = true;

        allregisters.items.forEach((item: order) => {
            if(item.userId === userid && item.status === "en proceso"){
                
                listuserregister = [{"code": 205}, item]
            }
        })


        return listuserregister;
    }


    @SubscribeMessage('client_join')
    handleJoinRoom(client: Socket){
        console.log('alguien ingreso');
    }
    handleIncomingMessage(payload:any){
        this.server.emit('event_message', payload)
    }


    @SubscribeMessage('events')
    handleEvent(@MessageBody() data: string): string {
        return data;
}
    
}
