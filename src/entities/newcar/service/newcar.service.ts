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
import { AgencyRepository } from 'src/entities/agency/repository/agency.repository';


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
        private UsedCarRepository: UsedCarRepository,
        private agencyRepository: AgencyRepository,

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
        

        // if (query.model && query.brand) {
        //     let newquery = await this.getAllModelOfBrands(query)

        //     const cars = await this.repository.findAll(newquery)
        //     const groupedCars = NewCarHelps.groupCarsByHash(cars.items)
        //     const response = {
        //         ...cars,
        //         items: groupedCars,
        //     }
        //     const r = {
        //         count: cars.count,
        //         items: response.items
        //     }

        //     return r
        // }
        // else {
        //     const cars = await this.repository.findAll(query)
        //     const groupedCars = NewCarHelps.groupCarsByHash(cars.items)
        //     const response = {
        //         ...cars,
        //         items: groupedCars,
        //     }
        //     const r = {
        //         count: cars.count,
        //         items: response.items
        //     }

        //     return r
        // }



    }

    async getfiltercount() {
        let counts: any = {
            nuevos: 0,
            brands: [],
            year: [],
            transmision: [],
            colours: [],
            chassisType: [],
            agencyId: [],
        }


        let filters = this.getFiltersValues()

        counts.nuevos = (await this.repository.findAll()).items.length;

        for (let brand of (await filters).brand) {
            let count = await (await this.repository.findAll({ brand: brand })).items.length
            counts.brands.push({ brand: brand, count: count })
        }

        for (let year of (await filters).year) {
            let count = await (await this.repository.findAll({ year: year.toString() })).items.length
            counts.year.push({ year: year, count: count })
        }

        for (let transmision of (await filters).transmision) {
            let count = await (await this.repository.findAll({ transmision: transmision })).items.length
            counts.transmision.push({ transmision: transmision, count: count })
        }
        for (let colour of (await filters).colours) {
            let count = await (await this.repository.findAll({ colours: colour })).items.length
            counts.colours.push({ colour: colour, count: count })
        }
        for (let chassistype of (await filters).chassisType) {
            let count = await (await this.repository.findAll({ chassisType: chassistype })).items.length
            counts.chassisType.push({ chassistype: chassistype, count: count })
        }
        for (let agencyId of (await filters).agencyId) {
            let count = await (await this.repository.findAll({ agencyId: agencyId })).items.length
            counts.agencyId.push({ agencyId: agencyId, count: count })
        }



        return counts

    }


    async getAllModelOfBrands(query: any) {

    
        const cars = await this.repository.findByBrands(query.brand)

        console.log(query)

        let allmodeles: any = [];

        for (let c of cars) {
            allmodeles.push(c.model)
        }

        console.log(allmodeles)

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
        let sugerencias: {brand:string, model: String[]}[] = []

        const cars: any = await this.repository.findAll();

        for (let car of cars.items) {
           
            const resultado = sugerencias.find(brand => brand.brand === car.brand)

            if(resultado)
                {
                    if (resultado.model.includes(car.model) === false) {
                        resultado.model.push(car.model)
                    }
                }
                else{
                    sugerencias.push({brand: car.brand, model: [car.model]})
                }
        }
        return sugerencias
    }

    async findfpromotions(chassisType: string){

        let promociones = []
        const cars: any = await this.repository.findAll({chassisType: chassisType});

        cars.items.forEach((car: any) => {
            if(car.promocion !== '' && car.promocion !== ' ' && car.promocion !== null)
            {
                promociones.push(car)
            }
        });

        return promociones
    }

    async findForString(body: any) {
    

        let tagsbusqueda = body.busqueda.split(' ');
      
        const cars: any = await this.repository.findAll();
        let carfinallist: any = [];

       if(body.type === 'develop')
       {
        if(tagsbusqueda.length > 1)
        {

           cars.items.forEach((car: any)  => {
            
            for(let tag of tagsbusqueda)
            {
                if (car.model === tag.toUpperCase() && car.brand === tagsbusqueda[0].toUpperCase()) {
                    console.log(body.busqueda)
                    carfinallist.push(car)
                }
            }
           });   
        }
        else
        {
            cars.items.forEach((car: any) => {

                console.log(car.brand, car.model)
                    if (car.brand.includes(body.busqueda.toUpperCase()) || car.brand.includes(body.busqueda.toLowerCase()) || car.model.includes(body.busqueda.toLowerCase()) || car.model.includes(body.busqueda.toUpperCase())) {

                        carfinallist.push(car)
                    }
                
            })

        }

       }

        if(body.type === 'produccion')
        {
            cars.items.forEach((car: any) => {

                let modalsarray = car.model.split(' ')

                    for(let model of modalsarray)
                        {
                          for(let tag of tagsbusqueda)
                            {
                               if(car.brand.toLowerCase() === tag.toLowerCase() || model.toLowerCase() === tag.toLowerCase())
                                {
                                    carfinallist.push(car)
                                } 
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
        if(car.images.length === 0){return [{error: 'no hay imagenes' }, {car}]}
        else{
            try{
                 const response = await this.httpService.get(car.images[0].imageUrl).toPromise()
            }
            catch(e)
            {
                return [{error: 'no hay imagenes en la dirreccion' }, {car}]
            }
        }
        if (carID === '' || carID === null || carID.length !== 17 ) { return [{ error: 'error en identificador unico ( vin o ID), no cumple con las condiciones == no nulo, no vacio, vin 0 ID incompleto (17 caracteres) ==' }, { car }] }
        if (car.agencyID === '' || car.agencyID === null) { return [{ error: 'sin agencyID' }, { car }] }
        if (car.brand === '' || car.brand === null) { return [{ error: 'sin brand' }, { car }] }
        if (car.model === '' || car.model === null) { return [{ error: 'error en model, revise el modelo, no debe contener signo o caracteres especiales' }, { car }] }
        if (car.series === '' || car.series === null) { return [{ error: 'serie vacia' }, { car }] }
        if (car.price === '' || car.price === null) { return [{ error: 'sin precio' }, { car }] }
        if (car.chassisType === '' || car.chassisType === null) { return [{ error: 'sin segmento' }, { car }] }
        if (car.year === '' || car.year === null) { return [{ error: 'sin año, verifique los datos ingresados' }, { car }] }
        if (car.transmision === '' || car.transmision === null && car.transmision) { return [{ error: 'sin transmision, verifique los datos' }, { car }] }
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
        let estadosCiudades = {
            "bajacalifornia": ["ensenada","mexicali","playas de rosarito","tecate","tijuana"],
            "bajacaliforniasur": ["comondu","la paz","loreto","los cabos","mulege"],
            "sinaloa": ["ahome","angostura","badiraguato","choix","concordia","cosala","culiacan","el fuerte","elota","escuinapa","guasave","mazatlan","mocorito","navolato","rosario","salvador alvarado","san ignacio","sinaloa"],
            "sonora": ["aconchi","agua prieta","alamos","altar","arivechi","arizpe","atil","bacadehuachi","bacanora","bacerac","bacoachi","bacum","banamichi","baviacora","bavispe","benito juarez","benjamin hill","caborca","cajeme","cananea","carbo","cucurpe","cumpas","divisaderos","empalme","etchojoa","fronteras","general plutarco elias calles","granados","guaymas","hermosillo","huachinera","huasabas","huatabampo","huepac","imuris","la colorada","magdalena","mazatan","moctezuma","naco","nacori chico","nacozari de garcia","navojoa","nogales","onavas","opodepe","oquitoa","pitiquito","puerto penasco","quiriego","rayon","rosario","sahuaripa","san felipe de jesus","san ignacio rio muerto","san javier","san luis rio colorado","san miguel de horcasitas","san pedro de la cueva","santa ana","santa cruz","saric","soyopa","suaqui grande","tepache","trincheras","tubutama","ures","villa hidalgo","villa pesqueira","yecora"],
            "nuevoleon": ["abasolo","agualeguas","allende","anahuac","apodaca","aramberri","bustamante","cadereyta jimenez","cerralvo","china","cienega de flores","doctor arroyo","doctor coss","doctor gonzalez","el carmen","galeana","garcia","general bravo","general escobedo","general teran","general trevino","general zaragoza","general zuazua","guadalupe","hidalgo","higueras","hualahuises","iturbide","juarez","lampazos de naranjo","linares","los aldama","los herreras","los ramones","marin","melchor ocampo","mier y noriega","mina","montemorelos","monterrey","paras","pesqueria","rayones","sabinas hidalgo","salinas victoria","san nicolas de los garza","san pedro garza garcia","santa catarina","santiago","vallecillo","villaldama"],
            "ciudadmexico": ["alvaro obregon","azcapotzalco","benito juarez","coyoacan","cuajimalpa de morelos","cuauhtemoc","gustavo a. madero","iztacalco","iztapalapa","la magdalena contreras","miguel hidalgo","milpa alta","tlalpan","tlahuac","venustiano carranza","xochimilco"]
        }

        // let estados = {
        //     'sinaloa': [],
        //     'sonora': [],
        //     'Baja California norte': [],
        //     'Baja California sur': [],
        //     'Nuevo Leon': [],
        //     'Ciudad de  Mexico': [],
        // }

        let estados: {estado: string, ciudades: string[]}[] = [
            {estado: 'Sinaloa', ciudades: [] },
            {estado: 'Baja california sur', ciudades: [] },
            {estado: 'Baja california norte', ciudades: [] },
            {estado: 'Sonora', ciudades: [] },
            {estado: 'Nuevo Leon', ciudades: [] },
            {estado: 'Ciudad de  Mexico', ciudades: [] }
        ]

        const allCars = await this.repository.findAll()

       
        for (let car of allCars.items) {
            if (estadosCiudades.bajacaliforniasur.includes(car.agencyCity.toLowerCase())) {

                const resultado =  estados.find(estado => estado.estado === 'Baja california sur')
             
                if(resultado.ciudades.includes(car.agencyCity) === false)
                    {
                        resultado.ciudades.push(car.agencyCity)
                    }
                
            }

            if (estadosCiudades.bajacalifornia.includes(car.agencyCity.toLowerCase()) ) {

                const resultado =  estados.find(estado => estado.estado === 'Baja california norte')

                 if(resultado.ciudades.includes(car.agencyCity) === false)
                    {
                        resultado.ciudades.push(car.agencyCity)
                    }
            }
            if (estadosCiudades.sinaloa.includes(car.agencyCity.toLowerCase())) {
               
               const resultado =  estados.find(estado => estado.estado === 'Sinaloa')

             if(resultado.ciudades.includes(car.agencyCity) === false)
                    {
                        resultado.ciudades.push(car.agencyCity)
                    }
            }

            if (estadosCiudades.sonora.includes(car.agencyCity.toLowerCase()) ) {
                const resultado =  estados.find(estado => estado.estado === 'Sonora')

                if(resultado.ciudades.includes(car.agencyCity) === false)
                    {
                        resultado.ciudades.push(car.agencyCity)
                    }
            }

            if (estadosCiudades.nuevoleon.includes(car.agencyCity.toLowerCase()) ) {
                const resultado =  estados.find(estado => estado.estado === 'Nuevo Leon')

               if(resultado.ciudades.includes(car.agencyCity) === false)
                    {
                        resultado.ciudades.push(car.agencyCity)
                    }
            }

            if (estadosCiudades.ciudadmexico.includes(car.agencyCity.toLowerCase()) ) {
                const resultado =  estados.find(estado => estado.estado === 'Ciudad de  Mexico')

                if(resultado.ciudades.includes(car.agencyCity) === false)
                    {
                        resultado.ciudades.push(car.agencyCity)
                    }
            }
          
        }

        const sets = {
            brand: new Set<string>(),
            year: new Set<number>(),
            transmision: new Set<string>(),
            colours: new Set<string>(),
            prices: new Set<number>(),
            km: new Set<number>(),
            chassistype: new Set<string>(),
            agencyId: new Set<string>(),
            promocioType: new Set<string>(),
            ubucacion: new Set<any>(),
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
            promocioType: [...sets.promocioType],
            ubication : estados
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

        let estadosCiudades = {
            "bajacalifornia": ["ensenada", "mexicali", "playas de rosarito", "tecate", "tijuana"],
            "bajacaliforniasur": ["comondu", "la paz", "loreto", "los cabos", "mulege"],
            "sinaloa": ["ahome", "angostura", "badiraguato", "choix", "concordia", "cosala", "culiacan", "el fuerte", "elota", "escuinapa", "guasave", "mazatlan", "mocorito", "navolato", "rosario", "salvador alvarado", "san ignacio", "sinaloa"],
            "sonora": ["aconchi", "agua prieta", "alamos", "altar", "arivechi", "arizpe", "atil", "bacadehuachi", "bacanora", "bacerac", "bacoachi", "bacum", "banamichi", "baviacora", "bavispe", "benito juarez", "benjamin hill", "caborca", "cajeme", "cananea", "carbo", "cucurpe", "cumpas", "divisaderos", "empalme", "etchojoa", "fronteras", "general plutarco elias calles", "granados", "guaymas", "hermosillo", "huachinera", "huasabas", "huatabampo", "huepac", "imuris", "la colorada", "magdalena", "mazatan", "moctezuma", "naco", "nacori chico", "nacozari de garcia", "navojoa", "nogales", "onavas", "opodepe", "oquitoa", "pitiquito", "puerto penasco", "quiriego", "rayon", "rosario", "sahuaripa", "san felipe de jesus", "san ignacio rio muerto", "san javier", "san luis rio colorado", "san miguel de horcasitas", "san pedro de la cueva", "santa ana", "santa cruz", "saric", "soyopa", "suaqui grande", "tepache", "trincheras", "tubutama", "ures", "villa hidalgo", "villa pesqueira", "yecora"],
            "nuevoleon": ["abasolo", "agualeguas", "allende", "anahuac", "apodaca", "aramberri", "bustamante", "cadereyta jimenez", "cerralvo", "china", "cienega de flores", "doctor arroyo", "doctor coss", "doctor gonzalez", "el carmen", "galeana", "garcia", "general bravo", "general escobedo", "general teran", "general trevino", "general zaragoza", "general zuazua", "guadalupe", "hidalgo", "higueras", "hualahuises", "iturbide", "juarez", "lampazos de naranjo", "linares", "los aldama", "los herreras", "los ramones", "marin", "melchor ocampo", "mier y noriega", "mina", "montemorelos", "monterrey", "paras", "pesqueria", "rayones", "sabinas hidalgo", "salinas victoria", "san nicolas de los garza", "san pedro garza garcia", "santa catarina", "santiago", "vallecillo", "villaldama"],
            "ciudadmexico": ["alvaro obregon", "azcapotzalco", "benito juarez", "coyoacan", "cuajimalpa de morelos", "cuauhtemoc", "gustavo a. madero", "iztacalco", "iztapalapa", "la magdalena contreras", "miguel hidalgo", "milpa alta", "tlalpan", "tlahuac", "venustiano carranza", "xochimilco"]
        }

        let vins = []

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
            2037, //gwm  mexicali
            2038, //gwm tijuana
            3038, //gwm mazatlan 
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


                            vins.push(sc.ID)

                            let agencia = await this.agencyRepository.findOne({ number: sc.agencyID })

                            let estate = ''

                            if (estadosCiudades.bajacalifornia.includes(sc.agencyCity.toLowerCase())) {
                                estate = 'Baja california norte'
                            }

                            if (estadosCiudades.bajacaliforniasur.includes(sc.agencyCity.toLowerCase())) {
                                estate = 'Baja california sur'
                            }

                            if (estadosCiudades.sinaloa.includes(sc.agencyCity.toLowerCase())) {
                                estate = 'Sinaloa'
                            }

                            if (estadosCiudades.sonora.includes(sc.agencyCity.toLowerCase())) {
                                estate = 'Sonora'
                            }

                            if (estadosCiudades.nuevoleon.includes(sc.agencyCity.toLowerCase())) {
                                estate = 'Nuevo Leon'
                            }

                            if(estadosCiudades.ciudadmexico.includes(sc.agencyCity.toLowerCase())) {
                                estate = 'Ciudad de  Mexico'
                            }
              
                            let lat = agencia.geoposition.lat || 0;
                            let lng = agencia.geoposition.lng || 0;


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

                           
                            let serie = sc.version.trim().toLowerCase();

                    
                            //if(true) {
                            let newCar: NewCar = {
                                vin: sc.ID,
                                promocioType: sc.promotionDescription.trim(),
                                agencyId: sc.agencyID.toString(),
                                promocion: promociontext.trim(),
                                promotionAmount: sc.promotionAmount,
                                brand: parsedBrand.toUpperCase(),
                                model: parsedModel,
                                series: serie.charAt(0).toUpperCase() + serie.slice(1).toLowerCase(),
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
                                specs: sc.specs,
                                estado: estate,
                                geoposition: {
                                    lat: lat.toString(),
                                    lng: lng.toString()
                                }
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

            let cars = await this.repository.findAll();

            let counts = {};
            let duplicates = [];

            for (let i = 0; i < vins.length; i++) {
                if (counts[vins[i]]) {
                    counts[vins[i]] += 1;
                } else {
                    counts[vins[i]] = 1;
                }
            }
            
            for (let vin in counts) {
                if (counts[vin] > 1) {
                    duplicates.push(vin);
                }
            }

            return {
                banCarlist: carlistban,
                count: newCarsArray.length,
                results: responses,

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
