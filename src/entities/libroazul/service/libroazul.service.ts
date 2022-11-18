import { Injectable} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class LibroazulService {

    private readonly libroAzulUser: string
    private readonly libroAzulPwd: string

    constructor(private readonly http: HttpService, private readonly configService: ConfigService) {
      this.libroAzulUser = this.configService.get<string>('libroAzul.user')
      this.libroAzulPwd = this.configService.get<string>('libroAzul.pwd')
    }

    async findAll(){   
        let clave = await this.http.post(`https://api.libroazul.com/Api/Sesion/?Usuario=${this.libroAzulUser}&Contrasena=${this.libroAzulPwd}`).toPromise()
        let data = await this.obteneredicones(clave.data)
        return data
    }

    async obteneredicones(clave: string) {
        let llave = {
          llave: clave
        }
        let ediciones = await this.http.post('https://api.libroazul.com/Api/Años/?Llave=' + clave).toPromise()
        return [ediciones.data, llave];
    }

    async obtenermarcas(data: any) {
        let respuesta = await this.http.post('https://api.libroazul.com/Api/Marcas/?Llave='+data.llave+'&ClaveAnio='+data.claveyear+'').toPromise()
        return respuesta.data;
    }

    async obtenermodelos(data: any) {
        let respuesta = await this.http.post('https://api.libroazul.com/Api/Modelos/?Llave='+data.llave+'&ClaveAnio='+data.claveyear+'&ClaveMarca='+data.clavemarca+'').toPromise()       
        return respuesta.data
    }

    async obtenerversiones(data: any) {
      let respuesta = await this.http.post('https://api.libroazul.com/Api/Versiones/?Llave='+data.llave+'&ClaveAnio='+data.claveyear+'&ClaveMarca='+data.clavemarca+'&ClaveModelo='+data.clavemodelo+'').toPromise()
      return respuesta.data;
    }
      
    async obtenerprecio(data: any) {
      let respuesta = await this.http.post('https://api.libroazul.com/Api/Precio/?Llave='+data.llave+'&ClaveVersion='+data.claveversion+'').toPromise()
      return respuesta.data;
    }
      

}
