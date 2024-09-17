import { HttpService } from '@nestjs/axios';
import {
    Injectable,
    Logger,
    UnauthorizedException,
    Inject,
    CACHE_MANAGER,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Cron } from '@nestjs/schedule';
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
import { FinishedcarsService } from 'src/entities/finishedcars/service/finishedcars.service';
import { UsedCarRepository } from 'src/entities/usedcar/repository/usedcar.repository';
import { AgencyRepository } from 'src/entities/agency/repository/agency.repository';
import { BugRepository } from 'src/entities/bugs/repository/bitacora.repository';

let x;

@Injectable()
export class NewCarService extends CrudService<typeof x> {
    setupCarsSecret: string;

    sadApiConfig = {
        baseUrl: null,
        username: null,
        password: null,
    };

    constructor(
        readonly repository: NewCarRepository,
        readonly config: ConfigService,
        private httpService: HttpService,
        private finishedcar: FinishedcarsService,
        private agencyRepository: AgencyRepository,
        private bugRepository: BugRepository,
    ) {
        super(repository, 'NewCar', config);
        this.sadApiConfig = {
            baseUrl: this.config.get('sadAPI.baseUrl'),
            username: this.config.get('sadAPI.username'),
            password: this.config.get('sadAPI.password'),
        };
        this.setupCarsSecret = this.config.get('setupCarsSecret');
        Logger.debug(this.setupCarsSecret, 'setupCarsSecret');
    }

    async findAll(
        query: FindAllNewCarsQuery,
    ): Promise<PaginatedEntities<NewCar>> {
        query.status = 'online';

        const cars = await this.repository.findAll(query);
        const groupedCars = NewCarHelps.groupCarsByHash(cars.items);
        const response = {
            ...cars,
            items: groupedCars,
        };
        const r = {
            count: groupedCars.length,
            items: response.items,
        };

        return r;
    }

    async findAllcars(
        query: FindAllNewCarsQuery,
    ): Promise<PaginatedEntities<NewCar>> {
        query.status = 'online';

        const cars = await this.repository.findAll(query);
        const groupedCars = NewCarHelps.groupCarsByHash(cars.items);
        const response = {
            ...cars,
            items: groupedCars,
        };
        const r = {
            count: groupedCars.length,
            items: response.items,
        };

        let brandsevents: any = [];
        let finalsearch: any = [];

        if (
            query.modelGroup &&
            query.modelGroup.length > 0 &&
            query.brand.length > 1
        ) {
            brandsevents = query.brand;

            if (query.brand.length > 1) {
                for (let brand of query.brand) {
                    query.brand = [];
                    query.brand.push(brand);
                    let cars = await this.repository.findAll(query);

                    if (cars.count > 0) {
                        for (let car of cars.items) {
                            finalsearch.push(car);
                        }
                    } else {
                        let carsonlybrands = await this.repository.findAll({
                            brand: query.brand,
                            status: 'online',
                        });
                        for (let car of carsonlybrands.items) {
                            finalsearch.push(car);
                        }
                    }
                }
            }

            r.items = NewCarHelps.groupCarsByHash(finalsearch);
            r.count = r.items.length;
        }

        return r;
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
        };

        let filters = this.getFiltersValues();

        counts.nuevos = (
            await this.repository.findAll({ status: 'online' })
        ).items.length;

        for (let brand of (await filters).brand) {
            let count = await (await this.repository.findAll({ brand: brand })).items
                .length;
            counts.brands.push({ brand: brand, count: count });
        }

        for (let year of (await filters).year) {
            let count = await (
                await this.repository.findAll({ year: year.toString() })
            ).items.length;
            counts.year.push({ year: year, count: count });
        }

        for (let transmision of (await filters).transmision) {
            let count = await (
                await this.repository.findAll({ transmision: transmision })
            ).items.length;
            counts.transmision.push({ transmision: transmision, count: count });
        }
        for (let colour of (await filters).colours) {
            let count = await (await this.repository.findAll({ colours: colour }))
                .items.length;
            counts.colours.push({ colour: colour, count: count });
        }
        for (let chassistype of (await filters).chassisType) {
            let count = await (
                await this.repository.findAll({ chassisType: chassistype })
            ).items.length;
            counts.chassisType.push({ chassistype: chassistype, count: count });
        }
        for (let agencyId of (await filters).agencyId) {
            let count = await (await this.repository.findAll({ agencyId: agencyId }))
                .items.length;
            counts.agencyId.push({ agencyId: agencyId, count: count });
        }

        return counts;
    }

    async getAllModelOfBrands(query: any) {
        const cars = await this.repository.findByBrands(query.brand);
        let allmodeles: any = [];
        for (let c of cars) {
            allmodeles.push(c.model);
        }
        for (let model of query.model) {
            if (allmodeles.includes(model) === false) {
                query.model = query.model.filter(i => i !== model);
            }
        }
        if (query.model.length === 0) {
            delete query.model;
        }
        return query;
    }

    async getnewmodels(brands: string[]) {
        let models = [];
        const newcars = await this.repository.findBymodelGroup(brands);
        const modelsSet = new Set<string>();

        for (let c of newcars) {
            modelsSet.add(c.modelGroup);
        }

        for (let model of modelsSet) {
            let newModel = {
                label: '',
                value: '',
                count: 0,
                isSelected: false,
            };

            let cars = await this.repository.findAll({
                modelGroup: model,
                status: 'online',
            });
            const groupedCars = await NewCarHelps.groupCarsByHash(cars.items);

            newModel.label = model;
            newModel.value = model;
            newModel.count = groupedCars.length;

            models.push(newModel);
        }

        return models;
    }

    async sugerenciasdebusqueda() {
        let sugerencias: { brand: string; model: String[] }[] = [];

        const cars: any = await this.repository.findAll();

        for (let car of cars.items) {
            const resultado = sugerencias.find(brand => brand.brand === car.brand);

            if (resultado) {
                if (resultado.model.includes(car.modelGroup) === false) {
                    resultado.model.push(car.modelGroup);
                }
            } else {
                sugerencias.push({ brand: car.brand, model: [car.modelGroup] });
            }
        }

        return sugerencias;
    }

    async findfpromotions(chassisType: string) {
        let promociones = [];
        const cars: any = await this.repository.findAll({
            chassisType: chassisType,
            status: 'online',
            limit: '20',
        });

        const groupedCars = NewCarHelps.groupCarsByHash(cars.items);

        groupedCars.forEach((car: any) => {
            if (
                car.promocion !== '' &&
                car.promocion !== ' ' &&
                car.promocion !== null
            ) {
                promociones.push(car);
            }
        });

        return promociones;
    }

    async findForString(body: any) {
        let tagsbusqueda = body.busqueda.split(' ');

        const cars: any = await this.repository.findAll({ status: 'online' });
        let carfinallist: any = [];

        if (body.type === 'develop') {
            if (tagsbusqueda.length > 1) {
                cars.items.forEach((car: any) => {
                    for (let tag of tagsbusqueda) {
                        if (
                            car.model === tag.toUpperCase() &&
                            car.brand === tagsbusqueda[0].toUpperCase()
                        ) {
                            console.log(body.busqueda);
                            carfinallist.push(car);
                        }
                    }
                });
            } else {
                cars.items.forEach((car: any) => {
                    console.log(car.brand, car.model);
                    if (
                        car.brand.includes(body.busqueda.toUpperCase()) ||
                        car.brand.includes(body.busqueda.toLowerCase()) ||
                        car.model.includes(body.busqueda.toLowerCase()) ||
                        car.model.includes(body.busqueda.toUpperCase())
                    ) {
                        carfinallist.push(car);
                    }
                });
            }
        }

        if (body.type === 'produccion') {
            cars.items.forEach((car: any) => {
                let modalsarray = car.model.split(' ');

                for (let model of modalsarray) {
                    for (let tag of tagsbusqueda) {
                        if (
                            car.brand.toLowerCase() === tag.toLowerCase() ||
                            model.toLowerCase() === tag.toLowerCase()
                        ) {
                            carfinallist.push(car);
                        }
                    }
                }
            });
        }

        const groupedCars = NewCarHelps.groupCarsByHash(carfinallist);
        const response = {
            ...cars,
            items: groupedCars,
        };
        const r = {
            count: cars.count,
            items: response.items,
        };

        return r;
    }

    async getNewCars() {
        return this.repository.findAll({ status: 'online' });
    }

    async findForSugerencias(
        query: FindAllNewCarsQuery,
    ): Promise<PaginatedEntities<NewCar>> {
        console.log(query);
        query.status = 'online';
        let onlybrand = query.modelGroup ? false : true;
        delete query.model;

        let lista = {
            items: [],
            count: 0,
        };

        if (onlybrand === true) {
            let busqueda = await this.repository.findAll({
                brand: query.brand,
                status: 'online',
            });
            const groupedCars = NewCarHelps.groupCarsByHash(busqueda.items);

            lista.items = groupedCars;
        } else {
            let busqueda = await this.repository.findAll({
                brand: query.brand,
                status: 'online',
                modelGroup: query.modelGroup,
            });
            const groupedCars = NewCarHelps.groupCarsByHash(busqueda.items);

            lista.items = groupedCars;
        }

        lista.count = lista.items.length;

        return lista;
    }

    async imgVerfication(car) {
        let sheetsIDs = [
            '800',
            '802',
            '901',
            '902',
            '903',
            '904',
            '905',
            '906',
            '907',
        ];

        if (car.images.length === 0) {
            return 'offline';
        } else {
            if (sheetsIDs.includes(car.agencyId)) {
                try {
                    const response = await this.httpService
                        .get(car.images[0])
                        .toPromise();

                    if (response.status === 200) {
                        return 'online';
                    }
                } catch (e) {
                    return 'offline';
                }
            } else {
                let imageurl =
                    car.images.filter(
                        img =>
                            img.imageUrl
                                .split('/')
                            [img.imageUrl.split('/').length - 1].split('.')[0] === 'fi',
                    ) || '';

                if (imageurl !== '') {
                    try {
                        const response: any = await this.httpService
                            .get(imageurl)
                            .toPromise();

                        if (response.status === 200) {
                            return 'online';
                        } else {
                        }
                    } catch (e) {
                        let imgfinal: any = await this.imgprincipal(car.images);
                        if (imgfinal !== 500) {
                            return 'online';
                        } else {
                            return 'offline';
                        }
                    }
                } else {
                    let imgfinal: any = await this.imgprincipal(car.images);
                    if (imgfinal !== 500) {
                        return 'online';
                    } else {
                        return 'offline';
                    }
                }
            }
        }
    }
    async carverification(car) {
        let carID = '';

        if (car.vin) {
            carID = car.vin;
        }
        if (car.ID) {
            carID = car.ID;
        }

        if (carID === '' || carID === null || carID.length !== 17) {
            return 'offline';
        }
        if (car.agencyID === '' || car.agencyID === null) {
            return 'offline';
        }
        if (car.brand === '' || car.brand === null) {
            return 'offline';
        }
        if (car.model === '' || car.model === null) {
            return 'offline';
        }
        if (car.series === '' || car.series === null) {
            return 'offline';
        }
        if (car.price === '' || car.price === null) {
            return 'offline';
        }
        if (car.chassisType === '' || car.chassisType === null) {
            return 'offline';
        }
        if (car.year === '' || car.year === null) {
            return 'offline';
        }
        if (
            car.transmision === '' ||
            (car.transmision === null && car.transmision)
        ) {
            return 'offline';
        }
        if (car.fuel === '' || car.fuel === null) {
            return 'offline';
        }
        if (car.colours === '' || car.colours === null) {
            return 'offline';
        }
        if (car.baseColour === '' || car.baseColour === null) {
            return 'offline';
        }

        return 'online';
    }

    async carModelVerification(car) {
        let carID = '';

        if (car.vin) {
            carID = car.vin;
        }
        if (car.ID) {
            carID = car.ID;
        }

        if (carID === '' || carID === null || carID.length !== 17) {
            return [
                {
                    error:
                        'error en identificador unico ( vin o ID), no cumple con las condiciones == no nulo, no vacio, vin 0 ID incompleto (17 caracteres) ==',
                },
                { car },
            ];
        }
        if (car.agencyID === '' || car.agencyID === null) {
            return [{ error: 'sin agencyID' }, { car }];
        }
        if (car.brand === '' || car.brand === null) {
            return [{ error: 'sin brand' }, { car }];
        }
        if (car.model === '' || car.model === null) {
            return [
                {
                    error:
                        'error en model, revise el modelo, no debe contener signo o caracteres especiales',
                },
                { car },
            ];
        }
        if (car.series === '' || car.series === null) {
            return [{ error: 'serie vacia' }, { car }];
        }
        if (car.price === '' || car.price === null) {
            return [{ error: 'sin precio' }, { car }];
        }
        if (car.chassisType === '' || car.chassisType === null) {
            return [{ error: 'sin segmento' }, { car }];
        }
        if (car.year === '' || car.year === null) {
            return [{ error: 'sin año, verifique los datos ingresados' }, { car }];
        }
        if (
            car.transmision === '' ||
            (car.transmision === null && car.transmision)
        ) {
            return [{ error: 'sin transmision, verifique los datos' }, { car }];
        }
        if (car.fuel === '' || car.fuel === null) {
            return [{ error: 'sin fuel' }, { car }];
        }
        if (car.colours === '' || car.colours === null) {
            return [{ error: 'sin colour' }, { car }];
        }
        if (car.baseColour === '' || car.baseColour === null) {
            return [{ error: 'sin colour' }, { car }];
        }

        return { status: 200, car: car };
    }

    async getByCarGroup(
        groupFilter: NewCarGroupFilter,
    ): Promise<{ cars: NewCar[]; colours: string[] }> {
        const cars = await this.repository.findByGroup(groupFilter);
        let coloursSet = new Set<string>();
        for (let car of cars) {
            coloursSet.add(car.colours as string);
        }
        return {
            cars,
            colours: [...coloursSet],
        };
    }

    async getFiltersValues(): Promise<NewCarsFilters> {
        let hh = new Date().toLocaleString();
        console.log('se obtuvieron filtros del catalogo usedcar a las: ' + hh);
        let estadosCiudades = {
            bajacalifornia: [
                'ensenada',
                'mexicali',
                'playas de rosarito',
                'tecate',
                'tijuana',
            ],
            bajacaliforniasur: ['comondu', 'la paz', 'loreto', 'los cabos', 'mulege'],
            sinaloa: [
                'ahome',
                'angostura',
                'badiraguato',
                'choix',
                'concordia',
                'cosala',
                'culiacan',
                'el fuerte',
                'elota',
                'escuinapa',
                'guasave',
                'mazatlan',
                'mocorito',
                'navolato',
                'rosario',
                'salvador alvarado',
                'san ignacio',
                'sinaloa',
            ],
            sonora: [
                'aconchi',
                'agua prieta',
                'alamos',
                'altar',
                'arivechi',
                'arizpe',
                'atil',
                'bacadehuachi',
                'bacanora',
                'bacerac',
                'bacoachi',
                'bacum',
                'banamichi',
                'baviacora',
                'bavispe',
                'benito juarez',
                'benjamin hill',
                'caborca',
                'cajeme',
                'cananea',
                'carbo',
                'cucurpe',
                'cumpas',
                'divisaderos',
                'empalme',
                'etchojoa',
                'fronteras',
                'general plutarco elias calles',
                'granados',
                'guaymas',
                'hermosillo',
                'huachinera',
                'huasabas',
                'huatabampo',
                'huepac',
                'imuris',
                'la colorada',
                'magdalena',
                'mazatan',
                'moctezuma',
                'naco',
                'nacori chico',
                'nacozari de garcia',
                'navojoa',
                'nogales',
                'onavas',
                'opodepe',
                'oquitoa',
                'pitiquito',
                'puerto penasco',
                'quiriego',
                'rayon',
                'rosario',
                'sahuaripa',
                'san felipe de jesus',
                'san ignacio rio muerto',
                'san javier',
                'san luis rio colorado',
                'san miguel de horcasitas',
                'san pedro de la cueva',
                'santa ana',
                'santa cruz',
                'saric',
                'soyopa',
                'suaqui grande',
                'tepache',
                'trincheras',
                'tubutama',
                'ures',
                'villa hidalgo',
                'villa pesqueira',
                'yecora',
            ],
            nuevoleon: [
                'abasolo',
                'agualeguas',
                'allende',
                'anahuac',
                'apodaca',
                'aramberri',
                'bustamante',
                'cadereyta jimenez',
                'cerralvo',
                'china',
                'cienega de flores',
                'doctor arroyo',
                'doctor coss',
                'doctor gonzalez',
                'el carmen',
                'galeana',
                'garcia',
                'general bravo',
                'general escobedo',
                'general teran',
                'general trevino',
                'general zaragoza',
                'general zuazua',
                'guadalupe',
                'hidalgo',
                'higueras',
                'hualahuises',
                'iturbide',
                'juarez',
                'lampazos de naranjo',
                'linares',
                'los aldama',
                'los herreras',
                'los ramones',
                'marin',
                'melchor ocampo',
                'mier y noriega',
                'mina',
                'montemorelos',
                'monterrey',
                'paras',
                'pesqueria',
                'rayones',
                'sabinas hidalgo',
                'salinas victoria',
                'san nicolas de los garza',
                'san pedro garza garcia',
                'santa catarina',
                'santiago',
                'vallecillo',
                'villaldama',
            ],
            ciudadmexico: [
                'ciudad obregon',
                'azcapotzalco',
                'ciudad de mexico',
                'benito juarez',
                'coyoacan',
                'cuajimalpa de morelos',
                'cuauhtemoc',
                'gustavo a. madero',
                'iztacalco',
                'iztapalapa',
                'la magdalena contreras',
                'miguel hidalgo',
                'milpa alta',
                'tlalpan',
                'tlahuac',
                'venustiano carranza',
                'xochimilco',
            ],
        };

        // let estados = {
        //     'sinaloa': [],
        //     'sonora': [],
        //     'Baja California norte': [],
        //     'Baja California sur': [],

        //     'Nuevo Leon': [],
        //     'Ciudad de  Mexico': [],
        // }

        let estados: { estado: string; ciudades: string[] }[] = [
            { estado: 'Sinaloa', ciudades: [] },
            { estado: 'Baja california sur', ciudades: [] },
            { estado: 'Baja california norte', ciudades: [] },
            { estado: 'Sonora', ciudades: [] },
            { estado: 'Nuevo Leon', ciudades: [] },
            { estado: 'Ciudad de  Mexico', ciudades: [] },
        ];

        const allCars = await this.repository.findAll({ status: 'online' });

        for (let car of allCars.items) {
            if (
                estadosCiudades.bajacaliforniasur.includes(car.agencyCity.toLowerCase())
            ) {
                const resultado = estados.find(
                    estado => estado.estado === 'Baja california sur',
                );

                if (resultado.ciudades.includes(car.agencyCity) === false) {
                    resultado.ciudades.push(car.agencyCity);
                }
            }

            if (
                estadosCiudades.bajacalifornia.includes(car.agencyCity.toLowerCase())
            ) {
                const resultado = estados.find(
                    estado => estado.estado === 'Baja california norte',
                );

                if (resultado.ciudades.includes(car.agencyCity) === false) {
                    resultado.ciudades.push(car.agencyCity);
                }
            }
            if (estadosCiudades.sinaloa.includes(car.agencyCity.toLowerCase())) {
                const resultado = estados.find(estado => estado.estado === 'Sinaloa');

                if (resultado.ciudades.includes(car.agencyCity) === false) {
                    resultado.ciudades.push(car.agencyCity);
                }
            }

            if (estadosCiudades.sonora.includes(car.agencyCity.toLowerCase())) {
                const resultado = estados.find(estado => estado.estado === 'Sonora');

                if (resultado.ciudades.includes(car.agencyCity) === false) {
                    resultado.ciudades.push(car.agencyCity);
                }
            }

            if (estadosCiudades.nuevoleon.includes(car.agencyCity.toLowerCase())) {
                const resultado = estados.find(
                    estado => estado.estado === 'Nuevo Leon',
                );

                if (resultado.ciudades.includes(car.agencyCity) === false) {
                    resultado.ciudades.push(car.agencyCity);
                }
            }

            if (estadosCiudades.ciudadmexico.includes(car.agencyCity.toLowerCase())) {
                const resultado = estados.find(
                    estado => estado.estado === 'Ciudad de  Mexico',
                );

                if (resultado.ciudades.includes(car.agencyCity) === false) {
                    resultado.ciudades.push(car.agencyCity);
                }
            }
        }

        let index = 0;
        for (let option of estados) {
            if (option.ciudades.length === 0) {
                estados.splice(index, 1);
                console.log(index);
            }
            index++;
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
            modelGroup: new Set<string>(),
        };

        let minPrice = Number.MAX_SAFE_INTEGER;
        let maxPrice = 0;
        for (let car of allCars.items) {
            sets.brand.add(car.brand);
            sets.year.add(+car.year);
            sets.agencyId.add(car.agencyId);
            sets.transmision.add(car.transmision);
            sets.colours.add(car.baseColour as string);
            maxPrice = Math.max(maxPrice, +car.price);
            minPrice = Math.min(minPrice, +car.price);
            sets.chassistype.add(car.chassisType);
            sets.promocioType.add(car.promocioType);
            sets.modelGroup.add(car.modelGroup);
        }
        //Logger.debug({minPrice, maxPrice})
        sets.prices.add(minPrice);
        sets.prices.add(maxPrice);

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
            ubication: estados,
            modelGroup: [...sets.modelGroup],
        };

        const otrosIndex = result.colours.indexOf('Otros');
        if (otrosIndex !== -1) {
            result.colours.splice(otrosIndex, 1);
            result.colours.push('Otros');
        }

        return result;
    }

    async getModelsByBrands(brands: string[]): Promise<{ models: string[] }> {
        const cars = await this.repository.findByBrands(brands);
        const modelsSet = new Set<string>();
        for (let c of cars) {
            modelsSet.add(c.model);
        }
        return {
            models: Array.from(modelsSet),
        };
    }

    async getcarbyvin(vin: string) {
        let CarList = await this.repository.findAll({ vin: vin });

        return CarList;
    }

    async imgprincipal(images: any) {
        let orderdata = ['f', 'fd', 'li', 'ld', 'ti', 'td', 't'];

        for (let image of images) {
            if (
                orderdata.includes(
                    image.imageUrl
                        .split('/')
                    [image.imageUrl.split('/').length - 1].split('.')[0],
                )
            )
                try {
                    const response: any = await this.httpService
                        .get(image.imageUrl)
                        .toPromise();
                    if (response.status === 200) {
                        return 200;
                    }
                } catch (e) { }
        }
        return 500;
    }

    async correctionfix() {
        let cars = await this.repository.findAll({ status: 'online', estado: '' });

        return cars;
    }

    async updateCarCatalogue() {
        let estadosCiudades = {
            bajacalifornia: [
                'ensenada',
                'mexicali',
                'playas de rosarito',
                'tecate',
                'tijuana',
            ],
            bajacaliforniasur: ['comondu', 'la paz', 'loreto', 'los cabos', 'mulege'],
            sinaloa: [
                'ahome',
                'angostura',
                'badiraguato',
                'choix',
                'concordia',
                'cosala',
                'culiacan',
                'los mochis',
                'el fuerte',
                'elota',
                'escuinapa',
                'guasave',
                'mazatlan',
                'mocorito',
                'navolato',
                'rosario',
                'salvador alvarado',
                'san ignacio',
                'sinaloa',
            ],
            sonora: [
                'aconchi',
                'agua prieta',
                'alamos',
                'altar',
                'arivechi',
                'arizpe',
                'atil',
                'bacadehuachi',
                'bacanora',
                'bacerac',
                'bacoachi',
                'bacum',
                'banamichi',
                'baviacora',
                'bavispe',
                'benito juarez',
                'benjamin hill',
                'caborca',
                'cajeme',
                'cananea',
                'carbo',
                'cucurpe',
                'cumpas',
                'divisaderos',
                'empalme',
                'etchojoa',
                'fronteras',
                'general plutarco elias calles',
                'granados',
                'guaymas',
                'hermosillo',
                'huachinera',
                'huasabas',
                'huatabampo',
                'huepac',
                'imuris',
                'la colorada',
                'magdalena',
                'mazatan',
                'moctezuma',
                'naco',
                'nacori chico',
                'nacozari de garcia',
                'navojoa',
                'nogales',
                'onavas',
                'opodepe',
                'oquitoa',
                'pitiquito',
                'puerto penasco',
                'quiriego',
                'rayon',
                'rosario',
                'sahuaripa',
                'san felipe de jesus',
                'san ignacio rio muerto',
                'san javier',
                'san luis rio colorado',
                'san miguel de horcasitas',
                'san pedro de la cueva',
                'santa ana',
                'santa cruz',
                'saric',
                'soyopa',
                'suaqui grande',
                'tepache',
                'trincheras',
                'tubutama',
                'ures',
                'villa hidalgo',
                'villa pesqueira',
                'yecora',
            ],
            nuevoleon: [
                'abasolo',
                'agualeguas',
                'allende',
                'anahuac',
                'apodaca',
                'aramberri',
                'bustamante',
                'cadereyta jimenez',
                'cerralvo',
                'china',
                'cienega de flores',
                'doctor arroyo',
                'doctor coss',
                'doctor gonzalez',
                'el carmen',
                'galeana',
                'garcia',
                'general bravo',
                'general escobedo',
                'general teran',
                'general trevino',
                'general zaragoza',
                'general zuazua',
                'guadalupe',
                'hidalgo',
                'higueras',
                'hualahuises',
                'iturbide',
                'juarez',
                'lampazos de naranjo',
                'linares',
                'los aldama',
                'los herreras',
                'los ramones',
                'marin',
                'melchor ocampo',
                'mier y noriega',
                'mina',
                'montemorelos',
                'monterrey',
                'paras',
                'pesqueria',
                'rayones',
                'sabinas hidalgo',
                'salinas victoria',
                'san nicolas de los garza',
                'san pedro garza garcia',
                'santa catarina',
                'santiago',
                'vallecillo',
                'villaldama',
            ],
            ciudadmexico: [
                'alvaro obregon',
                'ciudad de mexico',
                'azcapotzalco',
                'benito juarez',
                'coyoacan',
                'cuajimalpa de morelos',
                'cuauhtemoc',
                'gustavo a. madero',
                'iztacalco',
                'iztapalapa',
                'la magdalena contreras',
                'miguel hidalgo',
                'milpa alta',
                'tlalpan',
                'tlahuac',
                'venustiano carranza',
                'xochimilco',
            ],
        };

        let vins = [];

        let updateitem: int = 0;
        const { token } = await this.loginToSAD();
        // const deletedRecords = await this.repository.deleteMany({})
        // Logger.debug(`Deleted ${deletedRecords.affected} records`)
        let newCarsArray: NewCar[] = [];
        let agencyIds = [
            29,
            9,
            1031,
            3037,
            21,
            3040, // BYD Culiacan
            1, // Hyundai Culiacán
            5, // Toyota Mazatlán
            6, // Chevrolet Mazatlán
            7, // Hyundai Mazatlán
            8, // Hyundai Mexicali
            // Hyundai Tijuana
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
            //21,  Chevrolet Hermosillo
            22, // Chrysler Mochis 0 Stellantis Mochis
            23, // KIA Cabos
            24, // KIA Hermosillo
            25, // KIA La Paz
            26, // KIA Mochis
            27, // KIA Obregó
            28, // JAC Cualiacán

            1030, // Omoda Hermosillo
            //1031, // chirey mazatlan
            1032, //Stallantis caballito
            1033, //geely culiacan
            1034, //jac mochis
            1035, //geely hermosillo
            1037, //gwm culiacan
            2037, //gwm  mexicali
            2038, //gwm tijuana
            //3037, // chirey mochis
            3038, //gwm mazatlan
        ];
        let promises = [];
        try {
            for (let id of agencyIds) {
                promises.push(
                    this.httpService
                        .get<{ success: boolean; message: string; data: SADNewCar[] }>(
                            `http://201.116.249.45:1089/api/Vehicles?dealerId=${id}`,
                            {
                                headers: {
                                    Authorization: 'Bearer ' + token.trim(),
                                },
                            },
                        )
                        .toPromise(),
                );
            }

            const responses = await Promise.all(promises);

            let carlist = await this.repository.findAll();

            let carinlist = [];
            let carlistban = [];

            let carlistr = [];

            for (let response of responses) {
                if (response.data.success) {
                    const sadNewCars = response.data.data as SADNewCar[];

                    for (let sc of sadNewCars) {
                        let BDID: string = '';

                        carlist.items.forEach((car: any) => {
                            if (sc.ID === car.vin) {
                                BDID = car._id;
                                carinlist.push(sc.ID);
                            }
                        });

                        let verificacion: string = await this.carverification(sc);
                        let imgverification: string = 'onfline';

                        let finalstatus = 'offline';
                        let ImageproStatus = 'false';
                        let imgforimgpro: string = '';
                        let dealerId: number = 0;

                        let imgProVerification: any = await this.verificationImagePro(
                            sc.ID,
                        );

                        if (imgProVerification.status === false) {
                            imgverification = await this.imgVerfication(sc);
                        }

                        if (
                            imgProVerification.status === true &&
                            verificacion === 'online'
                        ) {
                            ImageproStatus = 'true';
                            finalstatus = 'online';
                            imgforimgpro = imgProVerification.img;
                            dealerId = imgProVerification.dealerId;
                        } else if (
                            imgverification === 'online' &&
                            verificacion === 'online'
                        ) {
                            finalstatus = 'online';
                        }

                        if (
                            sc.isAvailable === 'S' &&
                            sc.isReserved === 'N' &&
                            sc.demo !== 'S'
                        ) {
                            vins.push(sc.ID);

                            let agencia = await this.agencyRepository.findOne({
                                number: sc.agencyID,
                            });

                            let estate = '';

                            if (
                                estadosCiudades.bajacalifornia.includes(
                                    sc.agencyCity.toLowerCase(),
                                )
                            ) {
                                estate = 'Baja california norte';
                            }

                            if (
                                estadosCiudades.bajacaliforniasur.includes(
                                    sc.agencyCity.toLowerCase(),
                                )
                            ) {
                                estate = 'Baja california sur';
                            }

                            if (
                                estadosCiudades.sinaloa.includes(sc.agencyCity.toLowerCase())
                            ) {
                                estate = 'Sinaloa';
                            }

                            if (
                                estadosCiudades.sonora.includes(sc.agencyCity.toLowerCase())
                            ) {
                                estate = 'Sonora';
                            }

                            if (
                                estadosCiudades.nuevoleon.includes(sc.agencyCity.toLowerCase())
                            ) {
                                estate = 'Nuevo Leon';
                            }

                            if (
                                estadosCiudades.ciudadmexico.includes(
                                    sc.agencyCity.toLowerCase(),
                                )
                            ) {
                                estate = 'Ciudad de  Mexico';
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

                            let banModelList = [
                                'DENALI',
                                'MX',
                                'PE',
                                '4X4',
                                '2PTAS.',
                                'MAX',
                                ' S U V',
                                'SUV',
                                'PICK-UP',
                                'DOBLE CABINA',
                                'CHASIS CABINA',
                                'CHASIS',
                                'HATCH BACK',
                                'HATCHBACK',
                                'SEDAN',
                            ];

                            banModelList.forEach(stringindex => {
                                if (
                                    sc.model.includes(stringindex) &&
                                    sc.model.includes('HB20')
                                ) {
                                    newmodel = sc.model.replace(stringindex, '').trim();
                                } else {
                                    newmodel = sc.model;
                                }
                            });

                            if (sc.chassisType === 'S U V' || sc.chassisType === 'SUV') {
                                MetaDescription =
                                    'Compra tu Camioneta ' +
                                    sc.brand +
                                    ' ' +
                                    sc.model.split(' ')[0] +
                                    ' nueva de agencia. Solicitalo en linea desde cualquier lugar de mexico. 20 años de experiencia nos avalan. ¡Estrena tu auto ya!';
                                h1 =
                                    'Camioneta Nuevo ' +
                                    sc.brand +
                                    ' ' +
                                    sc.model +
                                    ' ' +
                                    sc.year;
                                chasystype = 'SUV';
                            } else if (
                                sc.chassisType === 'PICK-UP' ||
                                sc.chassisType === 'DOBLE CABINA'
                            ) {
                                MetaDescription =
                                    'Compra tu pickup ' +
                                    sc.model.split(' ')[0] +
                                    ' nueva de agencia. Solicitalo en linea desde cualquier lugar de mexico. 20 años de experiencia nos avalan. ¡Estrena tu auto ya!';
                                h1 =
                                    'Pickup Nuevo ' + sc.brand + ' ' + sc.model + ' ' + sc.year;
                                chasystype = 'PICK-UP';
                            } else if (
                                sc.chassisType === 'CHASIS CABINA' ||
                                sc.chassisType === 'CHASIS'
                            ) {
                                MetaDescription =
                                    'Compra tu Camioneta ' +
                                    sc.brand +
                                    ' ' +
                                    sc.model.split(' ')[0] +
                                    ' nueva de agencia. Solicitalo en linea desde cualquier lugar de mexico. 20 años de experiencia nos avalan. ¡Estrena tu auto ya!';
                                h1 =
                                    'Vehiculo de Carga Nuevo' +
                                    sc.brand +
                                    ' ' +
                                    sc.model +
                                    ' ' +
                                    sc.year;
                                chasystype = 'CHASIS';
                            } else if (
                                sc.chassisType === 'VAN' ||
                                sc.chassisType === 'MINIVAN' ||
                                sc.chassisType === 'PASAJEROS'
                            ) {
                                chasystype = 'VAN';
                            } else {
                                MetaDescription =
                                    'Compra tu ' +
                                    sc.brand +
                                    ' ' +
                                    sc.model.split(' ')[0] +
                                    ' nuevo de agencia. Solicitalo en linea desde cualquier lugar de mexico. 20 años de experiencia nos avalan. ¡Estrena tu auto ya!';
                                h1 = 'Auto Nuevo ' + sc.brand + ' ' + sc.model + ' ' + sc.year;

                                if (
                                    sc.chassisType === 'HATCH BACK' ||
                                    sc.chassisType === 'HATCHBACK'
                                ) {
                                    chasystype = 'HATCHBACK';
                                } else {
                                    chasystype = sc.chassisType;
                                }
                            }

                            if (sc.promotionAmount !== 0) {
                                promociontext =
                                    sc.promotionDescription +
                                    ' de ' +
                                    sc.promotionAmount.toLocaleString('en', {
                                        style: 'currency',
                                        currency: 'MXN',
                                    });
                            } else {
                                if (sc.promotionDescription === ' ') {
                                    promociontext = '';
                                } else {
                                    promociontext = sc.promotionDescription;
                                }
                            }

                            parsedModel = newmodel.replace('/', '-');
                            parsedBrand = sc.brand.replace('/', '-');
                            parsedSeries = sc.version.replace('/', '-');

                            let serie = sc.version.trim().toLowerCase();

                            let modelgroup = sc.model.split(' ');

                            let ModelExceptions = [
                                'corolla cross',
                                'grand i10',
                                'haval h6',
                                'haval Jolion',
                                'ora o3',
                            ];

                            if (modelgroup[0].toLowerCase() === sc.brand.toLowerCase()) {
                                modelgroup[0] = modelgroup[1];
                            }

                            if (modelgroup.length > 1) {
                                if (
                                    ModelExceptions.includes(
                                        modelgroup[0].toLowerCase() +
                                        ' ' +
                                        modelgroup[1].toLowerCase(),
                                    )
                                ) {
                                    modelgroup[0] =
                                        modelgroup[0].toUpperCase() +
                                        ' ' +
                                        modelgroup[1].toUpperCase();
                                }
                            }

                            let transmision: string = ''

                            let transmision_automactica = ['Autom�tica', 'AUTOMATICO', 'AUTOMATICA', 'IVT', 'CVT', 'Automática', 'Automatica']
                            let transmision_manual = ['MANUAL', 'Estándar', 'Manual']
                            let transmision_electrica = ['ELECTRICA', 'El�ctrica']


                            switch (true) {
                                case transmision_automactica.includes(sc.transmision):
                                    transmision = 'Automática'
                                    break;
                                case transmision_manual.includes(sc.transmision):
                                    transmision = 'Manual'
                                    break;
                                case transmision_electrica.includes(sc.transmision):
                                    transmision = 'Eléctrica'
                                    break;
                                default:
                                    transmision = sc.transmision.trim()
                            }


                            //if(true) {
                            let newCar: NewCar = {
                                vin: sc.ID,
                                promocioType: sc.promotionDescription.trim(),
                                agencyId: sc.agencyID.toString(),
                                promocion: promociontext.trim(),
                                promotionAmount: sc.promotionAmount,
                                brand: parsedBrand.toUpperCase(),
                                model: parsedModel,
                                modelGroup: modelgroup[0],
                                series:
                                    serie.charAt(0).toUpperCase() + serie.slice(1).toLowerCase(),
                                agencyCity: sc.agencyCity,
                                chassisType: chasystype,
                                metaTitulo:
                                    '' +
                                    sc.brand +
                                    ' ' +
                                    sc.model.split(' ')[0] +
                                    ' ' +
                                    sc.year +
                                    ' Nuevo En Linea | Estrena tu Auto',
                                metaDescription: MetaDescription,
                                h1Title: h1,
                                status: finalstatus,
                                brandUrl: NewCarHelps.stringToUrl(sc.brand),
                                modelUrl: NewCarHelps.stringToUrl(sc.model),
                                seriesUrl: NewCarHelps.stringToUrl(sc.version),
                                imgProStatus: ImageproStatus,
                                ImgProImg: imgforimgpro || '',
                                price: +sc.price,
                                dealerId: dealerId,
                                year: sc.year,
                                images: !sc.images ? [] : sc.images.map(i => i.imageUrl),
                                transmision: transmision,
                                fuel: sc.fuelType,
                                colours: sc.color,
                                baseColour: NewCarHelps.getBaseColour(sc.color),
                                specs: sc.specs,
                                estado: estate,
                                geoposition: {
                                    lat: lat.toString(),
                                    lng: lng.toString(),
                                },
                            };

                            console.log(newCar.transmision, newCar.vin, newCar.agencyId, sc.transmision)

                            if (BDID !== '') {
                                await this.repository.update(BDID, newCar);
                                updateitem++;
                            } else {
                                newCarsArray.push(newCar);
                            }
                        }
                    }
                }
            }

            // const createdCars = newCarsArray;

            const createdCars = await this.repository.createMany(newCarsArray);

            if (carinlist.length > 0) {
                carlist.items.forEach((car: any) => {
                    let bmwidlist = ['901', '902', '903', '904', '905', '906', '907'];

                    if (carinlist.includes(car.vin) || bmwidlist.includes(car.agencyId)) {
                    } else {
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
                        };
                        this.finishedcar.create(updateCar);
                        console.log('auto descartado: ', car.vin);
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

            this.deleteduplicateCars();
            console.log('se termino una actualizacion de catalogo');

            return {
                banCarlist: carlistban,
                count: newCarsArray.length,
                results: responses,
            };
        } catch (err) {
            console.log('error en update newcar: ' + err);
            Logger.error(err);
            throw err;
        } finally {
            let hh = new Date().toLocaleString();
            console.log(
                'se termino una actualizacion de catalogo usedcar a las: ' + hh,
            );
            Logger.debug(`Inserted ${newCarsArray.length} records`);
            Logger.debug(`Update ${updateitem} records`);
        }
    }

    getCarCatalogue(authHeader: string) {
        if (authHeader === 'automaticupdate') {
            this.updateCarCatalogue();
        } else if (authHeader !== this.setupCarsSecret) {
            throw new UnauthorizedException();
        } else {
            this.updateCarCatalogue();
        }
    }

    async deleteduplicateCars() {
        let cars = (await this.repository.findAll()).items;

        try {
            for (let car of cars) {
                let duplicate = cars.filter(carfilter => carfilter.vin === car.vin);

                if (duplicate.length > 2) {
                    let indice = duplicate.length;
                    for (let duplicatecar of duplicate) {
                        if (indice > 1) {
                            await this.repository.delete(duplicatecar._id);
                        }

                        indice--;
                    }
                }
            }
            return 'los autos duplicados han sido eliminados';
        } catch (e) {
            return e.message;
        }
    }

    async verificationImagePro(vin: string) {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'x-api-key': 'f3068c2c-1f7a-4f5a-b5e4-0612a2fe284c',
            };
            const response = await this.httpService
                .post(
                    'https://api.dealerimagepro.com/resources',
                    {
                        vin: vin,
                        autoport_id: 3874,
                    },
                    { headers: headers },
                )
                .toPromise();

            if (response.data.data.length > 0) {
                let img = response.data.data[0].photos[0].split('?')[0];
                return { img: img, status: true, dealerId: 3874 };
            } else {
                return { img: '', status: false, dealerId: 0 };
            }
        } catch (e) {
            Logger.error('error en verificacion de imagen de imagePro: ' + e);
            this.bugRepository.create({
                detalles: 'error en verificacion de imagen de pro: ' + e,
                type: 'bug',
                notas: [e.message],
                error: 'error en verificacion de imagen de pro',
            });
            return false;
        }
    }

    async verificationImageProSheets(vin: string, sheets: boolean) {
        let autoport_id = 3874;

        if (sheets === true) {
            autoport_id = 3873;
        }

        try {
            const headers = {
                'Content-Type': 'application/json',
                'x-api-key': 'f3068c2c-1f7a-4f5a-b5e4-0612a2fe284c',
            };
            const response = await this.httpService
                .post(
                    'https://api.dealerimagepro.com/resources',
                    {
                        vin: vin,
                        autoport_id: autoport_id,
                    },
                    { headers: headers },
                )
                .toPromise();

            if (response.data.data.length > 0) {
                let img = response.data.data[0].photos[0].split('?')[0];
                return { img: img, status: true, dealerId: autoport_id };
            } else {
                return { img: '', status: false, dealerId: autoport_id };
            }
        } catch (e) {
            console.log(e);
            Logger.error('error en verificacion de imagen de imagePro: ' + e);
            // this.bugRepository.create({
            //     detalles: 'error en verificacion de imagen de pro: ' + e,
            //     type: 'bug',
            //     notas: [e.message],
            //     error: 'error en verificacion de imagen de pro',
            // })
            return false;
        }
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async updatecatalogue() {
        await this.updateCarCatalogue();
    }

    private async loginToSAD(): Promise<{ token: string }> {
        const response = await this.httpService
            .post(`${this.sadApiConfig.baseUrl}/login/authenticate`, {
                userName: this.sadApiConfig.username,
                password: this.sadApiConfig.password,
            })
            .toPromise();

        return { token: response.data };
    }
}
