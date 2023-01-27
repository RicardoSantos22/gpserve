import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto'
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'


@WebSocketGateway(81, { cors:{ origin: '*'}, })

@Injectable()
export class OrdersService {
    private readonly bbvakey: string;


    constructor(private readonly configService: ConfigService){

        this.bbvakey = this.configService.get<string>('Multipagos.privatekey');
        
    }

    @WebSocketServer() server: Server;

    afterInit(server:any){
        console.log("sockets activos")
    }
    handleConnection( client: any, ...args: any[]){
        console.log("alguien inicio una compra")

    }

    async CreateOrder(body){

        console.log(body)
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

        let respuesta = {
            "Num_order" : (await N_order).toString(),
            "Num_referencia" : (await N_referencia).toString(),
            "Hmac" : hash,
            "finalamount": (await amount).toString()
        }

        return respuesta; 

    
    }

    async AddNewOrder(Order){

        
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
