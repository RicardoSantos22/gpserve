import {HttpService} from '@nestjs/axios';
import {Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {CrudService} from '../../../common/crud/crud.service';
import {NewCarsFilters} from '../../newcar/dto/new-cars-filters';
import {NewCarHelps} from '../../newcar/helpers/newcar.helps';
import {SADUsedCar} from '../entities/sad-used-car';
import {UsedCar} from '../model/usedcar.model';
import {Car as finishecar} from '../model/finishedcars.model';
import {UsedCarRepository} from '../repository/usedcar.repository';

import {Cron} from '@nestjs/schedule'
import {CronExpression} from '@nestjs/schedule/dist';
import {FinishedcarsService} from 'src/entities/finishedcars/service/finishedcars.service'
import { Agency } from 'src/entities/agency/model/agency.model';
import { FindAllUsedCarsQuery } from '../dto/find-all-usedcars-query';
import { PaginatedEntities } from 'src/common/models/paginated-entities.model';

let x;

@Injectable()
export class UsedCarService extends CrudService<typeof x> {

    setupCarsSecret: string

    sadApiConfig = {
        baseUrl: null,
        username: null,
        password: null
    }

    constructor(
        readonly repository: UsedCarRepository,
        readonly config: ConfigService,
        private finishedcar:FinishedcarsService,
        private httpService: HttpService
    ) {
        super(repository, 'UsedCar', config);
        this.sadApiConfig = {
            baseUrl: this.config.get('sadAPI.baseUrl'),
            username: this.config.get('sadAPI.username'),
            password: this.config.get('sadAPI.password')
        }
        this.setupCarsSecret = this.config.get('setupCarsSecret')
    }

    async getallcars() {
        return await this.repository.findAll();
    }


    async findAll(query: FindAllUsedCarsQuery): Promise<PaginatedEntities<UsedCar>> {


        if(query.model && query.brand)
        {
           let newquery = await this.getAllModelOfBrands(query)

           console.log(newquery)

           const cars = await this.repository.findAll(newquery)
   
   
           return cars
        }
        else{
            const cars = await this.repository.findAll(query)
   
    
            return cars
        }


  
    }


    async getAllModelOfBrands(query: any)
    {

        const cars = await this.repository.findByBrands(query.brand)

        let allmodeles: any = [];

        for (let c of cars) {
            allmodeles.push(c.model)
        }

        
        for(let model of query.model)
        {
           if(allmodeles.includes(model) === false)
           {
            query.model = query.model.filter((i) => i !== model)
           }
        }

        if(query.model.length === 0)
        {
            delete query.model;
        }
        
       return query

    }


    async findForString(body: any){
        const cars: any = await this.repository.findAll();
        let carfinallist: any = [];

        cars.items.forEach((car: any) => {


           if(car.model.includes(body.busqueda.toUpperCase()) ||  car.brand.includes(body.busqueda.toUpperCase()) || car.series.includes(body.busqueda.toUpperCase()))
           {
            carfinallist.push(car)
           }
        });

        return {items: carfinallist}
    }

    async carModelVerification(car){
        let carID = '';
        if(car.vin) { carID = car.vin}
        if(car.ID) { carID = car.ID }

        if(carID === '' || carID === null || carID.length !== 17){                 return [{error: 'error en vin, no cumple con las condiciones == no nulo, no vacio, vin incompleto (17 caracteres) =='}, {car}]}
        if(car.agencyID === '' || car.agencyID === null){                          return [{error: 'sin agencyID'}, {car}]}
        if(car.brand === '' || car.brand === null){                                return [{error: 'sin brand'}, {car}]}
        if(car.model === '' || car.model === null ){                               return [{error: 'error en model, revise el modelo, no debe contener signo o caracteres especiales'}, {car}]}
        if(car.series === '' || car.series === null ){                             return [{error: 'serie vacia o con caracteres especiales'}, {car}]}
        if(car.price === '' || car.price === null) {                               return [{error: 'sin precio'}, {car}]}
        if(car.chassisType === '' || car.chassisType === null){                    return [{error: 'sin segmento'}, {car}]}
        if(car.year === '' || car.year === null){                                  return [{error: 'sin año, verifique los datos ingresados'}, {car}]}
        if(car.transmision === '' || car.transmision === null){                    return [{error: 'sin transmision, verifique los datos'}, {car}]}
        if(car.fuel === '' || car.fuel === null){                                  return [{error: 'sin fuel'}, {car}]}
        if(car.colours === '' || car.colours === null){                            return [{error: 'sin colour'}, {car}]}
        if(car.baseColour === '' || car.baseColour === null) {                     return [{error: 'sin color base'}, {car}]}

        return 200
    
    }


    async getFiltersValues(): Promise<NewCarsFilters> {
        const allCars = await this.repository.findAll()
        const sets = {
            brand: new Set<string>(),
            year: new Set<number>(),
            transmision: new Set<string>(),
            colours: new Set<string>(),
            prices: new Set<number>(),
            km: new Set<number>(),
            chassistype: new Set<string>(),
            agencyId: new Set<string>(),
            promocioType: new Set<string>()
        }

        let minPrice = Number.MAX_SAFE_INTEGER
        let maxPrice = 0
        for (let car of allCars.items) {
            sets.brand.add(car.brand)
            sets.year.add(+car.year)
            if (car.transmision) sets.transmision.add(car.transmision)
            sets.colours.add(car.baseColour as string)
            maxPrice = Math.max(maxPrice, +car.price)
            minPrice = Math.min(minPrice, +car.price)
            sets.chassistype.add(car.chassisType)
            sets.agencyId.add(car.agencyId)
            sets.promocioType.add(car.promocioType)
        }
        //Logger.debug({minPrice, maxPrice})
        sets.prices.add(minPrice)
        sets.prices.add(maxPrice)

        const result: NewCarsFilters = {
            brand: [...sets.brand],
            year: [...sets.year].sort((y1, y2) => y1 - y2),
            transmision: [...sets.transmision],
            colours: [...sets.colours],
            prices: [...sets.prices],
            km: [...sets.km],
            chassisType: [...sets.chassistype],
            agencyId: [...sets.agencyId],
            promocioType: [...sets.promocioType]
        }

        const otrosIndex = result.colours.indexOf('Otros')
        if (otrosIndex !== -1) {
            result.colours.splice(otrosIndex, 1)
            result.colours.push('Otros')
        }
        return result

    }

    async getModelsByBrands(brands: string[]): Promise<{ models: string[] }> {

        let carros = [];
        const cars = await this.repository.findByBrands(brands)
        const modelsSet = new Set<string>()
        for (let c of cars) {
            modelsSet.add(c.model)
        }
        return {
            models: Array.from(modelsSet)
        }
    }

    async zadCarCatalogue(agency, token){

        let angeci: any = await this.httpService.get<{ success: boolean, message: string, data: SADUsedCar[] }>(
            `http://201.116.249.45:1089/api/Vehicles/Used?dealerId=${agency}`,
            {
                headers: {
                    'Authorization': 'Bearer ' + token.trim()
                }
            }
        ).toPromise()

        return angeci.data

    }

    async updateCarCatalogue() {

        let carros = []
        let updateitem = 0;
        const {token} = await this.loginToSAD()

        console.log(token)

        // const deletedRecords = await this.repository.deleteMany({})
        // Logger.debug(`Deleted ${deletedRecords.affected} records`)
        let usedCarsArray: UsedCar[] = []
        let agencyIds = [
            1, // Hyundai Culiacán
            5, // Toyota Mazatlán
            6, // Chevrolet Mazatlán
            7, // Hyundai Mazatlán
            8, // Hyundai Mexicali
            9, // Hyundai Tijuana
            10, // Hyundai Los Cabos
            11, // Hino Culiacán
            12, // Chevrolet Culiacán
            13, // GMC Culiacán
            14, // Toyota Culiacán
            15, // Toyota Zaragoza
            16, // Toyota Los Mochis
            17, // Toyota Guasave
            18, // Chrysler Culiacán
            19, // Land Rover Culiacán
            20, // Kia Culiacán
            21, // Chevrolet Hermosillo 1
            22, // Chrysler Mochis
            23, // KIA Cabos
            24, // KIA Hermosillo
            25, // KIA La Paz
            26, // KIA Mochis
            27, // KIA Obregón
            28, // JAC Cualiacán
            29, // Chirey Culiacan 
        ]
        let promises = []

        let carlist:any = [];
        try {


            
            for (let id of agencyIds) {
                promises.push(this.httpService.get<{ success: boolean, message: string, data: SADUsedCar[] }>(
                        `http://201.116.249.45:1089/api/Vehicles/Used?dealerId=${id}`,
                        {
                            headers: {
                                'Authorization': 'Bearer ' + token.trim()
                            }
                        }
                    ).toPromise()
                )

               
            }
            
            const responses: any = await Promise.all(promises)

    

        
            let carlist = await this.repository.findAll();
            let carinlist = [];
            let carlistban = [];
            let carlistlist = [];

            for (let response of responses) {
                if (response.data.success) {
                    const sadNewCars = response.data.data as SADUsedCar[]

                    for (let sc of sadNewCars) {

                    
                        
                         let BDID: string = '';
                        carlist.items.forEach((car: any) => {

                            if (sc.ID === car.vin) {

                                BDID = car._id;
                                carinlist.push(sc.ID)

                            }
                        })


                        let verificacion = await this.carModelVerification(sc)

                     

                        if (sc.isAvailable === 'S' && sc.isReserved === 'N' && verificacion === 200) {


                            console.log(sc.chassisType)
                            let MetaDescription: string;
                            let h1: string;
                            let chasystype: string;
                            let parsedBrand: string;
                            let parsedModel: string;
                            let parsedSeries: string;
                            let newmodel: string;
                            let promociontext: string;
                            let banModelList = ['DENALI', 'MX','PE','4X4', '2PTAS.' ,'MAX' ,' S U V', 'SUV', 'PICK-UP', 'DOBLE CABINA', 'CHASIS CABINA', 'CHASIS', 'HATCH BACK', 'HATCHBACK', 'SEDAN']

                            banModelList.forEach((stringindex) =>  { 

                            if(sc.model.includes(stringindex) && sc.model.includes('HB20')){

                                newmodel = sc.model.replace(stringindex, '').trim()
                            }
                            else {
                                newmodel = sc.model
                            }

                            

                           })

                            if (sc.chassisType === 'S U V' || sc.chassisType === 'SUV') {
                                MetaDescription = 'Compra tu Camioneta ' + sc.brand.trim() + ' ' + sc.model.trim() + ' Seminueva en línea, y te la llevamos a cualquier parte de México. 20 años de experiencia nos avalan. ¡Estrena tu auto ya!';
                                h1 = 'Camioneta Seminueva ' + sc.brand.trim() + ' ' + sc.model.trim() + ' ' + sc.year.trim();
                                chasystype = 'SUV';
                            } else if (sc.chassisType === 'PICK-UP' || sc.chassisType === 'DOBLE CABINA') {
                                MetaDescription = 'Compra tu pickup ' + sc.brand.trim() + ' Seminueva en línea, y te la llevamos a cualquier parte de México. 20 años de experiencia nos avalan. ¡Estrena tu auto ya!';
                                h1 = 'Pickup Seminueva' + sc.brand.trim() + ' ' + sc.model.trim() + ' ' + sc.year.trim();
                                chasystype = 'PICK-UP';
                            } else if (sc.chassisType === 'CHASIS CABINA' || sc.chassisType === 'CHASIS') {
                                MetaDescription = 'Compra tu Camioneta ' + sc.brand.trim() + ' ' + sc.model.trim() + ' Seminueva en línea, y te la llevamos a cualquier parte de México. 20 años de experiencia nos avalan. ¡Estrena tu auto ya!';
                                h1 = 'Vehiculo de Carga Seminuevo' + sc.brand.trim() + ' ' + sc.model.trim() + ' ' + sc.year.trim();
                                chasystype = 'CHASIS';
                            } 
                            else if (sc.chassisType === 'VAN' || sc.chassisType === 'MINIVAN' || sc.chassisType === 'PASAJEROS') {
                                chasystype = 'VAN';
                            } 
                            else {


                                MetaDescription = 'Compra tu ' + sc.brand.trim()+ ' ' + sc.model.trim() + ' Seminuevo en línea, y te lo llevamos a cualquier parte de México. 20 años de experiencia nos avalan. ¡Estrena tu auto ya!';
                                h1 = 'Auto Seminuevo ' + sc.brand.trim() + ' ' + sc.model.trim() + ' ' + sc.year.trim();
                                

                                if(sc.chassisType === 'HATCH BACK' || sc.chassisType === 'HATCHBACK' )
                                {
                                    chasystype = 'HATCHBACK';
                                }
                                else
                                {
                                    chasystype = sc.chassisType;
                                }
                            }

                            if(sc.promotionAmount !== 0)
                            {
                                promociontext = sc.promotionDescription + ' de ' + sc.promotionAmount.toLocaleString("en", {
                                    style: "currency",
                                    currency: "MXN"
                                });
                            }
                            else{
                                promociontext = sc.promotionDescription;
                            }


                            parsedModel = newmodel.replace('/','-').trim()                         
                            parsedBrand = sc.brand.replace('/','-').trim()                                                 
                            parsedSeries = sc.version.replace('/','-').trim()

                            //if(true) {
                            let usedCar: UsedCar = {
                                promocioType: sc.promotionDescription,
                                chassisType: chasystype,
                                promocion: sc.promotionDescription,
                                promotionAmount: sc.promotionAmount,
                                agencyCity: sc.agencyCity,
                                metaTitulo: ''+sc.brand.trim()+' '+sc.model.trim()+' '+ sc.year.trim()+' Seminuevo en Línea | Estrena tu Auto',
                                metaDescription: MetaDescription,
                                h1Title: h1,
                                vin: sc.ID,
                                agencyId: sc.agencyID.toString(),
                                brand: parsedBrand,
                                model: parsedModel,
                                status: 'online',
                                series: parsedSeries,
                                price: sc.price,
                                year: sc.year,
                                images: !sc.images ? [] : sc.images.map(i => i.imageUrl),
                                transmision: sc.transmision.trim(),
                                fuel: sc.fuelType.trim(),
                                colours: sc.color.trim(),
                                baseColour: NewCarHelps.getBaseColour(sc.color),
                                km: +sc.kmCount,
                                location: sc.agencyCity.trim(),
                                specs: sc.specs
                            }

                            if(sc.agencyID === 17)
                            {
                                console.log(sc)
                            }
                            
                            if (BDID !== '') {

                                await this.repository.update(BDID, usedCar)
                                updateitem++
                            } else {

                               

                                usedCarsArray.push(usedCar)
                            }
                        }
                        else {

                            if(verificacion !== 200){
                                carlistban.push(verificacion)
                            }
                            else {
                                carlist.items.forEach((car: any) => {

                                    if (sc.ID === car.vin) {
    
                                        this.finishedcar.create(car)
    
                                        console.log( 'auto descartado: ', car.vin)
                                        this.repository.delete(car._id)
                                    }
                                })
                            }

                        }
                    }
                }
            }

            if(carinlist.length > 0){

                
                carlist.items.forEach((car: any) => {

                    let bmwidlist = ['901', '902', '903', '904','905','906','907']

             
                    if(carinlist.includes(car.vin) || bmwidlist.includes(car.agencyId)){
                    }
                    else{ 
                        let updateCar: finishecar = {
                            id: car._id,
                            vin: car.vin,
                            agencyId: car.agencyId,
                            brand: car.brand,
                            model: car.model,
                            series: car.series,
                            chassisType: car.chassisType || '',
                            status: 'offline',
                            brandUrl: car.brandUrl,
                            modelUrl: car.modelUrl,
                            seriesUrl: car.seriesUrl,
                            price: car.price,
                            year: car.year,
                            images: car.images,
                            transmision: car.transmision,
                            fuel: car.fuel, 
                            colours: car.colours,
                            baseColour: car.baseColour,
                            specs: car.specs,
                            cartype: 'used',
                            km: car.km,
                        }
                        this.finishedcar.create(updateCar)

                        console.log( 'auto descartado: ', car.vin)
                        this.repository.delete(car._id)
                    }
                });
            }
            const createdCars = await this.repository.createMany(usedCarsArray)

            return {
                banCarlist: carlistban,
                count: carlistlist.length,
                results: carros,
                
            }


            
        } catch (err) {
            console.log('error en update usedcar: ' + err)
            Logger.error(err)
            throw err
        } finally {
            let hh = new Date().toLocaleString()
            console.log('se termino una actualizacion de catalogo usedcar a las: ' + hh)

            Logger.debug(`Inserted ${usedCarsArray.length} records`)
            Logger.debug(`Update ${updateitem} records`)
        }
    }

    async getUsedCarCatalogue(authHeader: string) {
        if (authHeader === "automaticupdate") {
            this.updateCarCatalogue();
        } else if (authHeader !== this.setupCarsSecret) {

            throw new UnauthorizedException()
        } else {
            this.updateCarCatalogue();
        }


    }

    async getcarbyvin(vin: string) {

        let CarList = await this.repository.findAll();

        let carfin;

        await CarList.items.forEach(car => {

            if (car.vin === vin) [
                carfin = car
            ]

        })
        return carfin;

    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async updatecatalogue() {
        await this.updateCarCatalogue();

    }

    private async loginToSAD(): Promise<{ token: string }> {
        const response = await this.httpService.post(`${this.sadApiConfig.baseUrl}/login/authenticate`, {
            userName: this.sadApiConfig.username,
            password: this.sadApiConfig.password
        }).toPromise()
        return {token: response.data}
    }


};
