import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto'

@Injectable()
export class OrdersService {

    private readonly bbvakey: string;

    constructor(private readonly configService: ConfigService){

        this.bbvakey = this.configService.get<string>('Multipagos.privatekey');
    }

    async CreateOrder(body){

        const N_order = this.CreateRamdomNum();

        const N_referencia = this.CreateRamdomNum();

        const amount = this.getminamount(body.amount);

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
}
