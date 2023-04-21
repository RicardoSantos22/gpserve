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

    async getFiltersValues(): Promise<NewCarsFilters> {
        const allCars = await this.repository.findAll()
        const sets = {
            brand: new Set<string>(),
            year: new Set<number>(),
            transmision: new Set<string>(),
            colours: new Set<string>(),
            prices: new Set<number>(),
            km: new Set<number>(),
            chassistype: new Set<string>()
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
            chassisType: [...sets.chassistype]
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

    async updateCarCatalogue() {
        let updateitem = 0;
        const {token} = await this.loginToSAD()
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
            21, // Chevrolet Hermosillo
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
        try {
            for (let id of agencyIds) {
                promises.push(this.httpService.get<{ success: boolean, message: string, data: SADUsedCar[] }>(
                        `${this.sadApiConfig.baseUrl}/Vehicles/Used?dealerId=${id}`,
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

                        if (sc.isAvailable === 'S' && sc.isReserved === 'N') {

                            
                            let MetaDescription: string;
                            let h1: string;
                            let chasystype: string;

                            if (sc.chassisType === 'S U V' || sc.chassisType === 'SUV') {
                                MetaDescription = 'Compra tu Camioneta ' + sc.brand.trim() + ' ' + sc.model.trim() + ' Seminueva en línea, y te la llevamos a cualquier parte de México. 20 años de experiencia nos avalan. ¡Estrena tu auto ya!';
                                h1 = 'Camioneta Seminueva ' + sc.brand.trim() + ' ' + sc.model.trim() + ' ' + sc.year.trim();
                                console.log(sc.chassisType)
                                chasystype = 'SUV';
                            } else if (sc.chassisType === 'PICK-UP' || sc.chassisType === 'DOBLE CABINA') {
                                MetaDescription = 'Compra tu pickup ' + sc.brand.trim() + ' Seminueva en línea, y te la llevamos a cualquier parte de México. 20 años de experiencia nos avalan. ¡Estrena tu auto ya!';
                                h1 = 'Pickup Seminueva' + sc.brand.trim() + ' ' + sc.model.trim() + ' ' + sc.year.trim();
                                chasystype = sc.chassisType;
                            } else if (sc.chassisType === 'CHASIS CABINA' || sc.chassisType === 'CHASIS') {
                                MetaDescription = 'Compra tu Camioneta ' + sc.brand.trim() + ' ' + sc.model.trim() + ' Seminueva en línea, y te la llevamos a cualquier parte de México. 20 años de experiencia nos avalan. ¡Estrena tu auto ya!';
                                h1 = 'Vehiculo de Carga Seminuevo' + sc.brand.trim() + ' ' + sc.model.trim() + ' ' + sc.year.trim();
                                chasystype = sc.chassisType;
                            } else {
                                MetaDescription = 'Compra tu ' + sc.brand.trim()+ ' ' + sc.model.trim() + ' Seminuevo en línea, y te lo llevamos a cualquier parte de México. 20 años de experiencia nos avalan. ¡Estrena tu auto ya!';
                                h1 = 'Auto Seminuevo ' + sc.brand.trim() + ' ' + sc.model.trim() + ' ' + sc.year.trim();
                                

                                if(sc.chassisType === 'HATCH BACK' || sc.chassisType === 'HATCHBACK' )
                                {
                                    chasystype = 'HATCHBACK';
                                }
                                else if(sc.chassisType === 'VAN' || sc.chassisType === 'MINIVAN')
                                {
                                    chasystype = 'VAN'
                                }
                                else
                                {
                                    chasystype = sc.chassisType;
                                }
                            }
                            //if(true) {
                            let usedCar: UsedCar = {
                                chassisType: chasystype,
                                metaTitulo: ''+sc.brand.trim()+' '+sc.model.trim()+' '+ sc.year.trim()+' Seminuevo en Línea | Estrena tu Auto',
                                metaDescription: MetaDescription,
                                h1Title: h1,
                                vin: sc.ID,
                                agencyId: sc.agencyID.toString(),
                                brand: sc.brand.trim(),
                                model: sc.model.trim(),
                                series: sc.version.trim(),
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
                            if (BDID !== '') {

                                await this.repository.update(BDID, usedCar)
                                updateitem++
                            } else {
                                usedCarsArray.push(usedCar)
                            }
                        }
                    }
                }
            }

            if(carinlist.length > 0){
                carlist.items.forEach((car: any) => {

                    let bmwidlist = ['901', '902', '903', '904','905','906','907']
                    
                    if(carinlist.includes(car.vin) || bmwidlist.includes(car.agencyId)){}
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
                        this.repository.delete(car._id)
                    }
                });
            }
            return this.repository.createMany(usedCarsArray)
        } catch (err) {
            Logger.error(err)
            throw err
        } finally {
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
