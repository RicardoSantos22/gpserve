import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, UnauthorizedException, Inject, CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Cron } from '@nestjs/schedule'
import { CronExpression } from '@nestjs/schedule/dist';
import { int } from 'aws-sdk/clients/datapipeline';

import { CrudService } from '../../../common/crud/crud.service';
import { PaginatedEntities } from '../../../common/models/paginated-entities.model';
import { FindAllNewCarsQuery } from '../dto/find-all-newcars-query';
import { NewCarGroupFilter } from '../dto/new-car-group-filter';
import { NewCarsFilters } from '../dto/new-cars-filters';
import { SADNewCar } from '../entities/sad-newcar';
import { NewCarHelps } from '../helpers/newcar.helps';
import { NewCar } from '../model/newcar.model';
import { NewCarRepository } from '../repository/newcar.repository';
import { Car as finishecar } from '../model/finishedcars.model';
import { FinishedcarsService } from 'src/entities/finishedcars/service/finishedcars.service'
import { UsedCarRepository } from 'src/entities/usedcar/repository/usedcar.repository';
import { Console } from 'console';


let x;

@Injectable()
export class NewCarService extends CrudService<typeof x> {


    setupCarsSecret: string

    sadApiConfig = {
        baseUrl: null,
        username: null,
        password: null
    }

    constructor(
        readonly repository: NewCarRepository,
        readonly config: ConfigService,
        private httpService: HttpService,
        private finishedcar: FinishedcarsService,
        private UsedCarRepository: UsedCarRepository

    ) {
        super(repository, 'NewCar', config);
        this.sadApiConfig = {
            baseUrl: this.config.get('sadAPI.baseUrl'),
            username: this.config.get('sadAPI.username'),
            password: this.config.get('sadAPI.password')
        }
        this.setupCarsSecret = this.config.get('setupCarsSecret')
        Logger.debug(this.setupCarsSecret, 'setupCarsSecret')
    }

    async findAll(query: FindAllNewCarsQuery): Promise<PaginatedEntities<NewCar>> {


        if (query.model && query.brand) {
            let newquery = await this.getAllModelOfBrands(query)

            const cars = await this.repository.findAll(newquery)
            const groupedCars = NewCarHelps.groupCarsByHash(cars.items)
            const response = {
                ...cars,
                items: groupedCars,
            }
            const r = {
                count: cars.count,
                items: response.items
            }

            return r
        }
        else {
            const cars = await this.repository.findAll(query)
            const groupedCars = NewCarHelps.groupCarsByHash(cars.items)
            const response = {
                ...cars,
                items: groupedCars,
            }
            const r = {
                count: cars.count,
                items: response.items
            }

            return r
        }



    }

    async getAllModelOfBrands(query: any) {

        const cars = await this.repository.findByBrands(query.brand)

        let allmodeles: any = [];

        for (let c of cars) {
            allmodeles.push(c.model)
        }


        for (let model of query.model) {
            if (allmodeles.includes(model) === false) {
                query.model = query.model.filter((i) => i !== model)
            }
        }

        if (query.model.length === 0) {
            delete query.model;
        }

        return query

    }

    async sugerenciasdebusqueda()
    {
        let sugerencias = []

        const cars: any = await this.repository.findAll();
        const usedcars: any = await this.UsedCarRepository.findAll();

        for(let car of cars.items)
        {
            let sugerencia = car.brand.toUpperCase() + ' ' + car.model.toUpperCase()

            if(sugerencias.includes(sugerencia))
            {}
            else{sugerencias.push(sugerencia)}
        }

        for(let car of usedcars.items)
        {
            let sugerencia = car.brand.toUpperCase() + ' ' + car.model.toUpperCase();
           
            if(sugerencias.includes(sugerencia))
            {}
            else{sugerencias.push(sugerencia)}
        }

        let allbrands = ['HYUNDAI', 'KIA', 'CHEVROLET', 'TOYOTA', 'GEELY', 'CHIREY', 'JEEP', 'GWM', 'GMC', 'BUICK', 'DODGE', 
        'FIAT', 'PEUGEOT', 'JAC', 'OMODA', 'NISSAN', 'HONDA', 'BMW', 'JAGUAR', 'MINI', 'FORD', 'SUSUKI', 'SEAT', 'VOLKSWAGEN', 'MERCEDES-BENZ', 'MAZDA', 'RENAULT', 'RAM', 'AUDI'];

        for(let brand of allbrands)
        {
            sugerencias.push(brand)
        }
        return sugerencias
    }

    async findForString(body: any) {
    
        console.log(body)
        let tagsbusqueda = body.busqueda.split(' ');
      
        const cars: any = await this.repository.findAll();
        let carfinallist: any = [];

       if(body.type === 'develop')
       {
        if(tagsbusqueda.length >= 1)
        {
         
           cars.items.forEach((car: any)  => {
            
            for(let tag of tagsbusqueda)
            {
                if (car.model === tag.toUpperCase() && car.brand === tagsbusqueda[0].toUpperCase()) {
                    console.log(car)
                    carfinallist.push(car)
                }
            }
           });   
        }
        else
        {
            cars.items.forEach((car: any) => {
                for(let tag of tagsbusqueda)
                {
                    if (car.brand.includes(tag.toUpperCase()) || car.brand.includes(tag.toLowerCase())) {
                        console.log(car)
                        carfinallist.push(car)
                    }
                }
            })

        }

       }

        if(body.type === 'produccion')
        {

            cars.items.forEach((car: any) => {
                for(let tag of tagsbusqueda)
                {
                    if (car.brand.includes(body.busqueda.toUpperCase()) || car.brand.includes(body.busqueda.toLowerCase()) || car.model.includes(body.busqueda.toLowerCase()) || car.model.includes(body.busqueda.toUpperCase()) ) {
                        console.log(car)
                        carfinallist.push(car)
                    }
                }
            })
        }

        
        const groupedCars = NewCarHelps.groupCarsByHash(carfinallist)
        const response = {
            ...cars,
            items: groupedCars,
        }
        const r = {
            count: cars.count,
            items: response.items
        }
        
        return r
    }

    async getNewCars() {

        return this.repository.findAll();
    }

    async carModelVerification(car) {

        let carID = '';

        if (car.vin) { carID = car.vin }
        if (car.ID) { carID = car.ID }

        if (carID === '' || carID === null || carID.length !== 17) { return [{ error: 'error en identificador unico ( vin o ID), no cumple con las condiciones == no nulo, no vacio, vin 0 ID incompleto (17 caracteres) ==' }, { car }] }
        if (car.agencyID === '' || car.agencyID === null) { return [{ error: 'sin agencyID' }, { car }] }
        if (car.brand === '' || car.brand === null) { return [{ error: 'sin brand' }, { car }] }
        if (car.model === '' || car.model === null) { return [{ error: 'error en model, revise el modelo, no debe contener signo o caracteres especiales' }, { car }] }
        if (car.series === '' || car.series === null) { return [{ error: 'serie vacia' }, { car }] }
        if (car.price === '' || car.price === null) { return [{ error: 'sin precio' }, { car }] }
        if (car.chassisType === '' || car.chassisType === null) { return [{ error: 'sin segmento' }, { car }] }
        if (car.year === '' || car.year === null) { return [{ error: 'sin año, verifique los datos ingresados' }, { car }] }
        if (car.transmision === '' || car.transmision === null) { return [{ error: 'sin transmision, verifique los datos' }, { car }] }
        if (car.fuel === '' || car.fuel === null) { return [{ error: 'sin fuel' }, { car }] }
        if (car.colours === '' || car.colours === null) { return [{ error: 'sin colour' }, { car }] }
        if (car.baseColour === '' || car.baseColour === null) { return [{ error: 'sin colour' }, { car }] }

        return 200

    }

    async getByCarGroup(groupFilter: NewCarGroupFilter): Promise<{ cars: NewCar[], colours: string[] }> {
        const cars = await this.repository.findByGroup(groupFilter)
        let coloursSet = new Set<string>()
        for (let car of cars) {
            coloursSet.add(car.colours as string)
        }
        return {
            cars,
            colours: [...coloursSet]
        }
    }

    async getFiltersValues(): Promise<NewCarsFilters> {
        let hh = new Date().toLocaleString()
        console.log('se obtuvieron filtros del catalogo usedcar a las: ' + hh)
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
            sets.agencyId.add(car.agencyId)
            sets.transmision.add(car.transmision)
            sets.colours.add(car.baseColour as string)
            maxPrice = Math.max(maxPrice, +car.price)
            minPrice = Math.min(minPrice, +car.price)
            sets.chassistype.add(car.chassisType)
            sets.promocioType.add(car.promocioType)
        }
        //Logger.debug({minPrice, maxPrice})
        sets.prices.add(minPrice)
        sets.prices.add(maxPrice)

        const result: NewCarsFilters = {
            brand: [...sets.brand],
            year: [...sets.year],
            transmision: [...sets.transmision],
            colours: [...sets.colours],
            prices: [...sets.prices],
            km: [...sets.km],
            agencyId: [...sets.agencyId],
            chassisType: [...sets.chassistype],
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
        const cars = await this.repository.findByBrands(brands)
        const modelsSet = new Set<string>()
        for (let c of cars) {
            modelsSet.add(c.model)
        }
        return {
            models: Array.from(modelsSet)
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

    async updateCarCatalogue() {
        let updateitem: int = 0;
        const { token } = await this.loginToSAD()
        // const deletedRecords = await this.repository.deleteMany({})
        // Logger.debug(`Deleted ${deletedRecords.affected} records`)
        let newCarsArray: NewCar[] = []
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
            18, // Chrysler Culiacán 0 Stellantis Culiacán
            19, // Land Rover Culiacán
            20, // Kia Culiacán
            21, // Chevrolet Hermosillo
            22, // Chrysler Mochis 0 Stellantis Mochis
            23, // KIA Cabos
            24, // KIA Hermosillo
            25, // KIA La Paz
            26, // KIA Mochis
            27, // KIA Obregó
            28, // JAC Cualiacán
            29, // Chirey Culiacan
            1030, // Omoda Hermosillo
            1032, //Stallantis caballito
            1033, //geely culiacan
            1034, //jac mochis
            1035, //geely hermosillo
            1037, //gwm culiacan
            // 30, 
        ]
        let promises = []
        try {
            for (let id of agencyIds) {
                promises.push(this.httpService.get<{ success: boolean, message: string, data: SADNewCar[] }>(
                    `http://201.116.249.45:1089/api/Vehicles?dealerId=${id}`,
                    {
                        headers: {
                            'Authorization': 'Bearer ' + token.trim()
                        }
                    }
                ).toPromise()
                )
            }
            const responses = await Promise.all(promises)

            let carlist = await this.repository.findAll();

            let carinlist = [];
            let carlistban = [];

            let carlistr = [];

            for (let response of responses) {
                if (response.data.success) {
                    const sadNewCars = response.data.data as SADNewCar[]



                    for (let sc of sadNewCars) {


                        let BDID: string = '';

                        carlist.items.forEach((car: any) => {
                            if (sc.ID === car.vin) {
                                BDID = car._id;
                                carinlist.push(sc.ID)

                            }

                        })

                        let verificacion = await this.carModelVerification(sc)


                        if (sc.isAvailable === 'S' && sc.isReserved === 'N' && sc.demo !== 'S' && verificacion === 200) {

                            console.log(sc.year)
                            let newmodel: string;
                            let MetaDescription: string;
                            let h1: string;
                            let chasystype: string;
                            let parsedBrand: string;
                            let parsedModel: string;
                            let parsedSeries: string;
                            let promociontext: string;

                            let banModelList = ['DENALI', 'MX', 'PE', '4X4', '2PTAS.', 'MAX', ' S U V', 'SUV', 'PICK-UP', 'DOBLE CABINA', 'CHASIS CABINA', 'CHASIS', 'HATCH BACK', 'HATCHBACK', 'SEDAN']


                            banModelList.forEach((stringindex) => {

                                if (sc.model.includes(stringindex) && sc.model.includes('HB20')) {

                                    newmodel = sc.model.replace(stringindex, '').trim()

                                }
                                else {
                                    newmodel = sc.model
                                }

                            })

                            if (sc.chassisType === 'S U V' || sc.chassisType === 'SUV') {
                                MetaDescription = 'Compra tu Camioneta ' + sc.brand + ' ' + sc.model.split(' ')[0] + ' nueva de agencia. Solicitalo en linea desde cualquier lugar de mexico. 20 años de experiencia nos avalan. ¡Estrena tu auto ya!';
                                h1 = 'Camioneta Nuevo ' + sc.brand + ' ' + sc.model + ' ' + sc.year;
                                chasystype = 'SUV';
                            } else if (sc.chassisType === 'PICK-UP' || sc.chassisType === 'DOBLE CABINA') {
                                MetaDescription = 'Compra tu pickup ' + sc.model.split(' ')[0] + ' nueva de agencia. Solicitalo en linea desde cualquier lugar de mexico. 20 años de experiencia nos avalan. ¡Estrena tu auto ya!';
                                h1 = 'Pickup Nuevo ' + sc.brand + ' ' + sc.model + ' ' + sc.year;
                                chasystype = 'PICK-UP';
                            } else if (sc.chassisType === 'CHASIS CABINA' || sc.chassisType === 'CHASIS') {
                                MetaDescription = 'Compra tu Camioneta ' + sc.brand + ' ' + sc.model.split(' ')[0] + ' nueva de agencia. Solicitalo en linea desde cualquier lugar de mexico. 20 años de experiencia nos avalan. ¡Estrena tu auto ya!';
                                h1 = 'Vehiculo de Carga Nuevo' + sc.brand + ' ' + sc.model + ' ' + sc.year;
                                chasystype = 'CHASIS';
                            }

                            else if (sc.chassisType === 'VAN' || sc.chassisType === 'MINIVAN' || sc.chassisType === 'PASAJEROS') {
                                chasystype = 'VAN';
                            }
                            else {

                                MetaDescription = 'Compra tu ' + sc.brand + ' ' + sc.model.split(' ')[0] + ' nuevo de agencia. Solicitalo en linea desde cualquier lugar de mexico. 20 años de experiencia nos avalan. ¡Estrena tu auto ya!';
                                h1 = 'Auto Nuevo ' + sc.brand + ' ' + sc.model + ' ' + sc.year;



                                if (sc.chassisType === 'HATCH BACK' || sc.chassisType === 'HATCHBACK') {
                                    chasystype = 'HATCHBACK';
                                }
                                else {
                                    chasystype = sc.chassisType;
                                }
                            }

                            if (sc.promotionAmount !== 0) {
                                promociontext = sc.promotionDescription + ' de ' + sc.promotionAmount.toLocaleString("en", {
                                    style: "currency",
                                    currency: "MXN"
                                });
                            }
                            else {

                                if(sc.promotionDescription === " ")
                                {
                                    promociontext = ""
                                }
                                else{
                                    promociontext = sc.promotionDescription;
                                }

                                
                            }


                            parsedModel = newmodel.replace('/', '-')
                            parsedBrand = sc.brand.replace('/', '-')
                            parsedSeries = sc.version.replace('/', '-')



                            //if(true) {
                            let newCar: NewCar = {
                                vin: sc.ID,
                                promocioType: sc.promotionDescription,
                                agencyId: sc.agencyID.toString(),
                                promocion: promociontext,
                                promotionAmount: sc.promotionAmount,
                                brand: parsedBrand.toUpperCase(),
                                model: parsedModel,
                                series: parsedSeries,
                                agencyCity: sc.agencyCity,
                                chassisType: chasystype,
                                metaTitulo: '' + sc.brand + ' ' + sc.model.split(' ')[0] + ' ' + sc.year + ' Nuevo En Linea | Estrena tu Auto',
                                metaDescription: MetaDescription,
                                h1Title: h1,
                                status: 'online',
                                brandUrl: NewCarHelps.stringToUrl(sc.brand),
                                modelUrl: NewCarHelps.stringToUrl(sc.model),
                                seriesUrl: NewCarHelps.stringToUrl(sc.version),
                                price: +sc.price,
                                year: sc.year,
                                images: !sc.images ? [] : sc.images.map(i => i.imageUrl),
                                transmision: sc.transmision,
                                fuel: sc.fuelType,
                                colours: sc.color,
                                baseColour: NewCarHelps.getBaseColour(sc.color),
                                specs: sc.specs
                            }
                            if (BDID !== '') {

                                await this.repository.update(BDID, newCar)
                                updateitem++
                            } else {
                                newCarsArray.push(newCar)
                            }


                        }
                        else {

                            if (verificacion !== 200) {
                                carlistban.push(verificacion)
                            }
                            else {
                                carlist.items.forEach((car: any) => {

                                    if (sc.ID === car.vin) {

                                        this.finishedcar.create(car)

                                        console.log('auto descartado: ', car.vin)
                                        this.repository.delete(car._id)
                                    }
                                })
                            }
                        }
                    }
                }
            }

            // const createdCars = newCarsArray;

            const createdCars = await this.repository.createMany(newCarsArray)

            if (carinlist.length > 0) {
                carlist.items.forEach((car: any) => {

                    let bmwidlist = ['901', '902', '903', '904', '905', '906', '907']

                    if (carinlist.includes(car.vin) || bmwidlist.includes(car.agencyId)) { }
                    else {
                        let updateCar: finishecar = {
                            id: car._id,
                            vin: car.vin,
                            agencyId: car.agencyId,
                            brand: car.brand,
                            model: car.model,
                            series: car.series,
                            chassisType: car.chassisType,
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
                            cartype: 'new',
                            km: 0,
                        }
                        this.finishedcar.create(updateCar)
                        console.log('auto descartado: ', car.vin)
                        this.repository.delete(car._id)
                    }
                });
            }

            return {
                banCarlist: carlistban,
                count: newCarsArray.length,
                results: createdCars,

            }
        } catch (err) {
            console.log('error en update newcar: ' + err)
            Logger.error(err)
            throw err
        } finally {
            let hh = new Date().toLocaleString()
            console.log('se termino una actualizacion de catalogo usedcar a las: ' + hh)
            Logger.debug(`Inserted ${newCarsArray.length} records`)
            Logger.debug(`Update ${updateitem} records`)
        }
    }

    getCarCatalogue(authHeader: string) {
        if (authHeader === "automaticupdate") {
            this.updateCarCatalogue();
        } else if (authHeader !== this.setupCarsSecret) {

            throw new UnauthorizedException()
        } else {
            this.updateCarCatalogue();
        }


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
        return { token: response.data }
    }
};
