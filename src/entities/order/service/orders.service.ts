import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto'
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'


@WebSocketGateway(3000, { cors:{ origin: '*'}, })

@Injectable()
export class OrdersService {
    private readonly bbvakey: string;


    constructor(private readonly configService: ConfigService){

        this.bbvakey = 'M94eF#-09dKGeDN9u=-b=j2(4&Xe)f3U9+o134i&0y3(75XsSNE0MO6sEe-M!l)7G1%7(d6v$i#Kp-9sFkVo=&lB1#Pm2OL6kf##=kv7R%K9rLjb#3#+R9I&6E#Kh7B#';
        
    }

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
