import { Injectable} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';


@Injectable()
export class LibroazulService {

    constructor(private readonly http: HttpService){}

    async findAll(){
     
        let clave = await this.http.post('https://api.libroazul.com/Api/Sesion/?Usuario=demoKalyptio005471&Contrasena=roma3374').toPromise()

        let data = await this.obteneredicones(clave.data)
        return data
      }

      async obteneredicones(clave)
      {
        let llave = {
          llave: clave
        }
        let ediciones = await this.http.post('https://api.libroazul.com/Api/Años/?Llave=' + clave).toPromise()

        return [ediciones.data, llave];
      }

      async obtenermarcas(data: any)
      {
        let respuesta = await this.http.post('https://api.libroazul.com/Api/Marcas/?Llave='+data.llave+'&ClaveAnio='+data.claveyear+'').toPromise()

        return respuesta.data;

      }

      async obtenermodelos(data: any)
      {
        let respuesta = await this.http.post('https://api.libroazul.com/Api/Modelos/?Llave='+data.llave+'&ClaveAnio='+data.claveyear+'&ClaveMarca='+data.clavemarca+'').toPromise()       
        return respuesta.data

      }

      async obtenerversiones(data: any){
        let respuesta = await this.http.post('https://api.libroazul.com/Api/Versiones/?Llave='+data.llave+'&ClaveAnio='+data.claveyear+'&ClaveMarca='+data.clavemarca+'&ClaveModelo='+data.clavemodelo+'').toPromise()

        return respuesta.data;

      }
      
      async obtenerprecio(data: any){
        let respuesta = await this.http.post('https://api.libroazul.com/Api/Precio/?Llave='+data.llave+'&ClaveVersion='+data.claveversion+'').toPromise()
      

        return respuesta.data;

      }
      

}
