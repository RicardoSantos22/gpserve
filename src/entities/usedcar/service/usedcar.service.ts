import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CrudService } from '../../../common/crud/crud.service';
import { NewCarsFilters } from '../../newcar/dto/new-cars-filters';
import { NewCarHelps } from '../../newcar/helpers/newcar.helps';
import { SADUsedCar } from '../entities/sad-used-car';
import { UsedCar } from '../model/usedcar.model';
import { Car as finishecar } from '../model/finishedcars.model';
import { UsedCarRepository } from '../repository/usedcar.repository';
import { AgencyRepository } from 'src/entities/agency/repository/agency.repository';
import { Cron } from '@nestjs/schedule'
import { CronExpression } from '@nestjs/schedule/dist';
import { FinishedcarsService } from 'src/entities/finishedcars/service/finishedcars.service'
import { FindAllUsedCarsQuery } from '../dto/find-all-usedcars-query';
import { PaginatedEntities } from 'src/common/models/paginated-entities.model';
import { BugRepository } from 'src/entities/bugs/repository/bitacora.repository';
import { error } from 'console';


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
        private finishedcar: FinishedcarsService,
        private httpService: HttpService,
        private agencyrepository: AgencyRepository,
        private bugRepository: BugRepository,
    ) {
        super(repository, 'bug', config);
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

        query.status = 'online'

        return await this.repository.findAll(query)
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
        console.log(query)
        return query

    }

    async sugerenciasdebusqueda() {
        let sugerencias: { brand: string, model: String[] }[] = []

        const cars: any = await this.repository.findAll();

        for (let car of cars.items) {

            const resultado = sugerencias.find(brand => brand.brand === car.brand)

            if (resultado) {
                if (resultado.model.includes(car.model) === false) {
                    resultado.model.push(car.model)
                }
            }
            else {
                sugerencias.push({ brand: car.brand, model: [car.model] })
            }
        }
        return sugerencias
    }


    async getfiltercount() {
        let counts: any = {
            seminuevos: 0,
            brands: [],
            year: [],
            transmision: [],
            colours: [],
            chassisType: [],
            agencyId: [],
        }


        let filters = this.getFiltersValues()

        counts.seminuevos = (await this.repository.findAll()).items.length;

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



    async findfpromotions(chassisType: string) {

        let promociones = []
        const cars: any = await this.repository.findAll({ chassisType: chassisType });

        cars.items.forEach((car: any) => {
            if (car.promocion !== '' && car.promocion !== ' ' && car.promocion !== null) {
                promociones.push(car)
            }
        });

        return promociones
    }


    async findForString(body: any) {



        let tagsbusqueda = body.busqueda.split(' ');
        const cars: any = await this.repository.findAll();
        let carfinallist: any = [];

        if (body.type === 'develop') {
            if (tagsbusqueda.length > 1) {

                cars.items.forEach((car: any) => {

                    for (let tag of tagsbusqueda) {
                        if (car.model === tag.toUpperCase() && car.brand === tagsbusqueda[0].toUpperCase()) {
                            carfinallist.push(car)
                        }
                    }
                });
            }
            else {
                cars.items.forEach((car: any) => {

                    console.log(car.brand, car.model)
                    if (car.brand.includes(body.busqueda.toUpperCase()) || car.brand.includes(body.busqueda.toLowerCase()) || car.model.includes(body.busqueda.toLowerCase()) || car.model.includes(body.busqueda.toUpperCase())) {

                        carfinallist.push(car)
                    }

                })

            }

        }

        if (body.type === 'produccion') {

            cars.items.forEach((car: any) => {

                let modalsarray = car.model.split(' ')
                for (let model of modalsarray) {
                    for (let tag of tagsbusqueda) {
                        if (car.brand.toLowerCase() === tag.toLowerCase() || model.toLowerCase() === tag.toLowerCase()) {
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


    async imgVerfication(car) {
        let sheetsIDs = ['800', '802', '901', '902', '903', '904', '905', '906', '907']

        if (car.images.length === 0) {

            this.bugRepository.create({
                error: 'este auto no tiene imagenes dentro de su array',
                type: 'imgError',
                notas: car,
                detalles: car.ID,
                status: 'Sin Procesar',
                userId: ''
            })

            return 'offline'
        }
        else {

            if (sheetsIDs.includes(car.agencyId)) {
                try {
                    const response = await this.httpService.get(car.images[0]).toPromise()

                    if (response.status === 200) {
                        return 'online'
                    }
                }
                catch (e) {

                    this.bugRepository.create({
                        error: 'este auto no tiene imagenes validas en S3',
                        type: 'imgError',
                        notas: car,
                        detalles: car.ID,
                        status: 'Sin Procesar',
                        userId: ''
                    })

                    return 'offline'
                }


            }
            else {


                let imageurl = car.images.filter(img => img.imageUrl.split('/')[img.imageUrl.split('/').length - 1].split('.')[0] === 'fi') || ''

                if (imageurl !== '') {
                    try {
                        const response: any = await this.httpService.get(imageurl).toPromise()

                        if (response.status === 200) {
                            return 'online'
                        }
                        else {
                            this.bugRepository.create({
                                error: 'este auto no tiene imagen fi en s3',
                                type: 'imgError',
                                notas: car,
                                detalles: car.ID,
                                status: 'Sin Procesar',
                                userId: ''
                            })
                        }

                    }
                    catch (e) {


                        let imgfinal: any = await this.imgprincipal(car.images)
                        if (imgfinal !== 500) {
                            return 'online'
                        }
                        else {

                            this.bugRepository.create({
                                error: 'este auto no tiene imagenes validas en S3',
                                type: 'imgError',
                                notas: car,
                                detalles: car.ID,
                                status: 'Sin Procesar',
                                userId: ''
                            })

                            return 'offline'
                        }
                    }

                }
                else {

                    this.bugRepository.create({
                        error: 'este auto no tiene alguna imagen fi dentro de su array',
                        type: 'imgError',
                        notas: car,
                        detalles: car.ID,
                        status: 'Sin Procesar',
                        userId: ''
                    })

                    let imgfinal: any = await this.imgprincipal(car.images)
                    if (imgfinal !== 500) {
                        return 'online'
                    }
                    else {

                        this.bugRepository.create({
                            error: 'este auto no tiene imagenes validas en S3',
                            type: 'imgError',
                            notas: car,
                            detalles: car.ID,
                            status: 'Sin Procesar',
                            userId: ''
                        })

                        return 'offline'
                    }

                }
            }

        }
    }

    async carverification(car) {




        let carID = '';

        if (car.vin) { carID = car.vin }
        if (car.ID) { carID = car.ID }

        if (carID === '' || carID === null || carID.length !== 17) { return 'offline' }
        if (car.agencyID === '' || car.agencyID === null) { return 'offline' }
        if (car.brand === '' || car.brand === null) { return 'offline' }
        if (car.model === '' || car.model === null) { return 'offline' }
        if (car.series === '' || car.series === null) { return 'offline' }
        if (car.price === '' || car.price === null) { return 'offline' }
        if (car.chassisType === '' || car.chassisType === null) { return 'offline' }
        if (car.year === '' || car.year === null) { return 'offline' }
        if (car.transmision === '' || car.transmision === null) { return 'offline' }
        if (car.fuel === '' || car.fuel === null) { return 'offline' }
        if (car.colours === '' || car.colours === null) { return 'offline' }
        if (car.baseColour === '' || car.baseColour === null) { return 'offline' }


        return 'online'

    }




    async getFiltersValues(): Promise<NewCarsFilters> {

        let estadosCiudades = {
            "bajacalifornia": ["ensenada", "mexicali", "playas de rosarito", "tecate", "tijuana"],
            "bajacaliforniasur": ["comondu", "la paz", "loreto", "los cabos", "mulege"],
            "sinaloa": ["ahome", "angostura", "badiraguato", "choix", "concordia", "cosala", "culiacan", "el fuerte", "elota", "escuinapa", "guasave", "mazatlan", "mocorito", "navolato", "rosario", "salvador alvarado", "san ignacio", "sinaloa"],
            "sonora": ["aconchi", "agua prieta", "alamos", "altar", "arivechi", "arizpe", "atil", "bacadehuachi", "bacanora", "bacerac", "bacoachi", "bacum", "banamichi", "baviacora", "bavispe", "benito juarez", "benjamin hill", "caborca", "cajeme", "cananea", "carbo", "cucurpe", "cumpas", "divisaderos", "empalme", "etchojoa", "fronteras", "general plutarco elias calles", "granados", "guaymas", "hermosillo", "huachinera", "huasabas", "huatabampo", "huepac", "imuris", "la colorada", "magdalena", "mazatan", "moctezuma", "naco", "nacori chico", "nacozari de garcia", "navojoa", "nogales", "onavas", "opodepe", "oquitoa", "pitiquito", "puerto penasco", "quiriego", "rayon", "rosario", "sahuaripa", "san felipe de jesus", "san ignacio rio muerto", "san javier", "san luis rio colorado", "san miguel de horcasitas", "san pedro de la cueva", "santa ana", "santa cruz", "saric", "soyopa", "suaqui grande", "tepache", "trincheras", "tubutama", "ures", "villa hidalgo", "villa pesqueira", "yecora"],
            "nuevoleon": ["abasolo", "agualeguas", "allende", "anahuac", "apodaca", "aramberri", "bustamante", "cadereyta jimenez", "cerralvo", "china", "cienega de flores", "doctor arroyo", "doctor coss", "doctor gonzalez", "el carmen", "galeana", "garcia", "general bravo", "general escobedo", "general teran", "general trevino", "general zaragoza", "general zuazua", "guadalupe", "hidalgo", "higueras", "hualahuises", "iturbide", "juarez", "lampazos de naranjo", "linares", "los aldama", "los herreras", "los ramones", "marin", "melchor ocampo", "mier y noriega", "mina", "montemorelos", "monterrey", "paras", "pesqueria", "rayones", "sabinas hidalgo", "salinas victoria", "san nicolas de los garza", "san pedro garza garcia", "santa catarina", "santiago", "vallecillo", "villaldama"],
            "ciudadmexico": ["alvaro obregon", "azcapotzalco", "benito juarez", "coyoacan", "cuajimalpa de morelos", "cuauhtemoc", "gustavo a. madero", "iztacalco", "iztapalapa", "la magdalena contreras", "miguel hidalgo", "milpa alta", "tlalpan", "tlahuac", "venustiano carranza", "xochimilco"]
        }

        let estados: { estado: string, ciudades: string[] }[] = [
            { estado: 'Sinaloa', ciudades: [] },
            { estado: 'Baja california sur', ciudades: [] },
            { estado: 'Baja california norte', ciudades: [] },
            { estado: 'Sonora', ciudades: [] },
            { estado: 'Nuevo Leon', ciudades: [] },
            { estado: 'Ciudad de Mexico', ciudades: [] }
        ]

        const allCars = await this.repository.findAll({ status: 'online' })


        for (let car of allCars.items) {
            if (estadosCiudades.bajacaliforniasur.includes(car.agencyCity.toLowerCase())) {

                const resultado = estados.find(estado => estado.estado === 'Baja california sur')

                if (resultado.ciudades.includes(car.agencyCity) === false) {
                    resultado.ciudades.push(car.agencyCity)
                }

            }

            if (estadosCiudades.bajacalifornia.includes(car.agencyCity.toLowerCase())) {

                const resultado = estados.find(estado => estado.estado === 'Baja california norte')

                if (resultado.ciudades.includes(car.agencyCity) === false) {
                    resultado.ciudades.push(car.agencyCity)
                }
            }
            if (estadosCiudades.sinaloa.includes(car.agencyCity.toLowerCase())) {

                const resultado = estados.find(estado => estado.estado === 'Sinaloa')

                if (resultado.ciudades.includes(car.agencyCity) === false) {
                    resultado.ciudades.push(car.agencyCity)
                }
            }

            if (estadosCiudades.sonora.includes(car.agencyCity.toLowerCase())) {
                const resultado = estados.find(estado => estado.estado === 'Sonora')

                if (resultado.ciudades.includes(car.agencyCity) === false) {
                    resultado.ciudades.push(car.agencyCity)
                }
            }

            if (estadosCiudades.nuevoleon.includes(car.agencyCity.toLowerCase())) {
                const resultado = estados.find(estado => estado.estado === 'Nuevo Leon')

                if (resultado.ciudades.includes(car.agencyCity) === false) {
                    resultado.ciudades.push(car.agencyCity)
                }
            }

            if (estadosCiudades.ciudadmexico.includes(car.agencyCity.toLowerCase())) {
                const resultado = estados.find(estado => estado.estado === 'Ciudad de  Mexico')

                if (resultado.ciudades.includes(car.agencyCity) === false) {
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

        let minkm = 0;
        let maxkm = 0;

        for (let car of allCars.items) {
            sets.brand.add(car.brand)
            sets.year.add(+car.year)
            if (car.transmision) sets.transmision.add(car.transmision)
            sets.colours.add(car.baseColour as string)
            maxPrice = Math.max(maxPrice, +car.price)
            minPrice = Math.min(minPrice, +car.price)
            maxkm = Math.max(maxkm, +car.km)
            sets.chassistype.add(car.chassisType)
            sets.agencyId.add(car.agencyId)
            sets.promocioType.add(car.promocioType)
        }
        //Logger.debug({minPrice, maxPrice})
        sets.prices.add(minPrice)
        sets.prices.add(maxPrice)

        sets.km.add(minkm)
        sets.km.add(maxkm)

        sets.ubucacion.add(estados)

        const result: NewCarsFilters = {
            brand: [...sets.brand],
            year: [...sets.year].sort((y1, y2) => y1 - y2),
            transmision: [...sets.transmision],
            colours: [...sets.colours],
            prices: [...sets.prices],
            km: [...sets.km],
            chassisType: [...sets.chassistype],
            agencyId: [...sets.agencyId],
            promocioType: [...sets.promocioType],
            ubication: estados
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

    async zadCarCatalogue(agency, token) {

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

    async imgprincipal(images: any) {
        let orderdata = ['f', 'fd', 'li', 'ld', 'ti', 'td', 't']

        for (let image of images) {

            if (orderdata.includes(image.imageUrl.split('/')[image.imageUrl.split('/').length - 1].split('.')[0]))

                try {
                    const response: any = await this.httpService.get(image.imageUrl).toPromise()
                    if (response.status === 200) {
                        return 200
                    }

                }
                catch (e) { }
        }
        return 500
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

        let carros = []
        let updateitem = 0;
        const { token } = await this.loginToSAD()

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
            1030, // Omoda Hermosillo 
            1031, // chirey mazatlan
            1032, //Stallantis caballito
            1033, //geely culiacan
            1034, //jac mochis
            1035, //geely hermosillo
            1037, //gwm culiacan
            2037, //gwm  mexicali
            2038, //gwm tijuana
            3037, // chirey mochis
            3038, //gwm mazatlan 
        ]
        let promises = []

        let carlist: any = [];
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

            let data = []


            let carlist = await this.repository.findAll();
            let carinlist = [];
            let carlistban = [];
            let carlistlist = [];

            for (let response of responses) {
                if (response.data.success) {
                    const sadNewCars = response.data.data as SADUsedCar[]

                    data = sadNewCars
                    for (let sc of sadNewCars) {



                        let BDID: string = '';

                        carlist.items.forEach((car: any) => {
                            if (sc.ID === car.vin) {
                                BDID = car._id;
                                carinlist.push(sc.ID)

                            }

                        })





                        let verificacion: string = await this.carverification(sc)
                        let imgverification: string = 'onfline'

                        let finalstatus = 'offline'
                        let ImageproStatus = 'false'
                        let imgforimgpro: string = ''

                        let imgProVerification:any = await this.verificationImagePro(sc.ID)

            
                        if(imgProVerification.status === false){
                            imgverification =  await this.imgVerfication(sc)
                        }


                    
                        if (imgProVerification.status === true && verificacion === 'online') 
                        {
                            ImageproStatus = 'true'
                            finalstatus = 'online'
                            imgforimgpro = imgProVerification.img
                        }
                        else if (imgverification === 'online' && verificacion === 'online') {
                            finalstatus = 'online'
                        }

                        vins.push(sc.ID)


                        if (sc.isAvailable === 'S' && sc.isReserved === 'N') {

                            let agencia = await this.agencyrepository.findOne({ number: sc.agencyID })


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

                            if (estadosCiudades.ciudadmexico.includes(sc.agencyCity.toLowerCase())) {
                                estate = 'Ciudad de  Mexico'
                            }

                            let lat = agencia.geoposition.lat || 0;
                            let lng = agencia.geoposition.lng || 0;

                            let MetaDescription: string;
                            let h1: string;
                            let chasystype: string;
                            let parsedBrand: string;
                            let parsedModel: string;
                            let parsedSeries: string;
                            let newmodel: string;
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


                                MetaDescription = 'Compra tu ' + sc.brand.trim() + ' ' + sc.model.trim() + ' Seminuevo en línea, y te lo llevamos a cualquier parte de México. 20 años de experiencia nos avalan. ¡Estrena tu auto ya!';
                                h1 = 'Auto Seminuevo ' + sc.brand.trim() + ' ' + sc.model.trim() + ' ' + sc.year.trim();


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
                                if (sc.promotionDescription === " ") {
                                    promociontext = ""
                                }
                                else {
                                    promociontext = sc.promotionDescription;
                                }
                            }


                            parsedModel = sc.model.replace('/', '-')
                            parsedBrand = sc.brand.replace('/', '-')
                            parsedSeries = sc.version.replace('/', '-')

                            let serie = sc.version.trim().toLowerCase();



                            //if(true) {
                            let usedCar: UsedCar = {
                                promocioType: sc.promotionDescription.trim(),
                                chassisType: chasystype,
                                promocion: sc.promotionDescription.trim(),
                                promotionAmount: sc.promotionAmount,
                                agencyCity: sc.agencyCity,
                                metaTitulo: '' + sc.brand.trim() + ' ' + sc.model.trim() + ' ' + sc.year.trim() + ' Seminuevo en Línea | Estrena tu Auto',
                                metaDescription: MetaDescription,
                                h1Title: h1,
                                vin: sc.ID,
                                agencyId: sc.agencyID.toString(),
                                brand: parsedBrand.toUpperCase(),
                                model: parsedModel,
                                status: finalstatus,
                                series: serie.charAt(0).toUpperCase() + serie.slice(1).toLowerCase(),
                                price: parseInt(sc.price),
                                imgProStatus: ImageproStatus,
                                ImgProImg: imgforimgpro || '',
                                year: sc.year,
                                images: !sc.images ? [] : sc.images.map(i => i.imageUrl),
                                transmision: sc.transmision.trim(),
                                fuel: sc.fuelType.trim(),
                                colours: sc.color.trim(),
                                baseColour: NewCarHelps.getBaseColour(sc.color),
                                km: +sc.kmCount,
                                location: sc.agencyCity.trim(),
                                specs: sc.specs,
                                estado: estate,
                                geoposition: {
                                    lat: lat.toString(),
                                    lng: lng.toString()
                                }
                            }
                            console.log(usedCar.ImgProImg)
                     

                            if (BDID !== '') {

                                await this.repository.update(BDID, usedCar)
                                updateitem++
                            } else {
                                usedCarsArray.push(usedCar)
                            }
                        }
                        // else {

                        //     if (verificacion.status !== 200) {
                        //         carlistban.push(verificacion)
                        //     }
                        //     else {
                        //         carlist.items.forEach((car: any) => {

                        //             if (sc.ID === car.vin) {

                        //                 this.finishedcar.create(car)

                        //                 this.repository.delete(car._id)
                        //             }
                        //         })
                        //     }

                        // }
                    }
                }
            }

            if (carinlist.length > 0) {


                carlist.items.forEach((car: any) => {

                    let bmwidlist = ['800', '901', '902', '903', '904', '905', '906', '907']


                    if (carinlist.includes(car.vin) || bmwidlist.includes(car.agencyId)) {
                    }
                    else {
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
                            createmenys: [],
                            vins: [],
                            duplicates: [],
                        }
                        this.finishedcar.create(updateCar)
                        console.log('auto descartado: ', car.vin)
                        this.repository.delete(car._id)
                    }
                });
            }

            const createdCars = await this.repository.createMany(usedCarsArray)

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

            // let bitacora = {
            //     status: 'zad',
            //     vins: vins,
            //     createmenys: createdCars,
            //     duplicates: duplicates,
            // }
            // let a = await this.finishedcar.create(bitacora)


            return {
                banCarlist: carlistban,
                count: carlistlist.length,
                results: vins,
                duplicates: duplicates
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



    async verificationImagePro(vin: string) {

        try {
            const headers = {
                'Content-Type': 'application/json',
                'x-api-key': 'f3068c2c-1f7a-4f5a-b5e4-0612a2fe284c',
    
            };
            const response = await this.httpService.post('https://api.dealerimagepro.com/resources', {
                vin: vin,
                autoport_id: 3874
            }, { headers: headers }
    
            ).toPromise()
    
  
            if (response.data.data.length > 0) {

          
                let img = response.data.data[0].photos[0].split('?')[0]
                return {img: img, status: true}
            }
            else {
                return {img: '', status: false}
            }
    
        }
        catch (e) {
            Logger.error('error en verificacion de imagen de imagePro: ' + e)
            this.bugRepository.create({
                detalles: 'error en verificacion de imagen de pro: ' + e,
                type: 'bug',
                notas: [e.message],
                error: 'error en verificacion de imagen de pro',
            })
            return false
        }
      
    }





    private async loginToSAD(): Promise<{ token: string }> {
        const response = await this.httpService.post(`${this.sadApiConfig.baseUrl}/login/authenticate`, {
            userName: this.sadApiConfig.username,
            password: this.sadApiConfig.password
        }).toPromise()
        return { token: response.data }
    }


    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async updatecatalogue() {
        await this.updateCarCatalogue();

    }





};
