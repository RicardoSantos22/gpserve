import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


import { CrudService } from '../../../common/crud/crud.service';
import { PaginatedEntities } from '../../../common/models/paginated-entities.model';
import { FindAllNewCarsQuery } from '../dto/find-all-newcars-query';
import { NewCarGroupFilter } from '../dto/new-car-group-filter';
import { NewCarsFilters } from '../dto/new-cars-filters';
import { SADNewCar } from '../entities/sad-newcar';
import { NewCarHelps } from '../helpers/newcar.helps';
import { NewCar } from '../model/newcar.model';
import { NewCarRepository } from '../repository/newcar.repository';

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
    private httpService: HttpService
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
    return this.repository.findAll(query)
  }

  async getByCarGroup(groupFilter: NewCarGroupFilter): Promise<{cars: NewCar[], colours: string[]}> {
    const cars = await this.repository.findByGroup(groupFilter)
    let coloursSet = new Set<string>()
    for(let car of cars) {
      coloursSet.add(car.colours as string)
    }
    return {
      cars,
      colours: [...coloursSet]
    }
  }

  async getFiltersValues(): Promise<NewCarsFilters> {
    const allCars = await this.repository.findAll()
    const sets = {
      brand: new Set<string>(),
      year: new Set<number>(),
      transmision: new Set<string>(),
      colours: new Set<string>(),
      prices: new Set<number>()
    }

    let minPrice = Number.MAX_SAFE_INTEGER
    let maxPrice = 0
    for(let car of allCars.items) {
      sets.brand.add(car.brand)
      sets.year.add(+car.year)
      sets.transmision.add(car.transmision)
      sets.colours.add(car.baseColour as string)
      maxPrice = Math.max(maxPrice, +car.price)
      minPrice = Math.min(minPrice, +car.price)
    }
    //Logger.debug({minPrice, maxPrice})
    sets.prices.add(minPrice)
    sets.prices.add(maxPrice)

    const result: NewCarsFilters = {
      brand: [...sets.brand],
      year: [...sets.year],
      transmision: [...sets.transmision],
      colours: [...sets.colours],
      prices: [...sets.prices]
    }

    const otrosIndex = result.colours.indexOf('Otros')
    if(otrosIndex !== -1) {
      result.colours.splice(otrosIndex, 1)
      result.colours.push('Otros')
    }
    return result

  }

  async getModelsByBrands(brands: string[]): Promise<{ models: string[] }> {
    const cars = await this.repository.findByBrands(brands)
    const modelsSet = new Set<string>()
    for(let c of cars) {
      modelsSet.add(c.model)
    }
    return {
      models: Array.from(modelsSet)
    }
  }

  async getcarbyvin(vin : string){

    let CarList = await this.repository.findAll();

    let carfin;

    await CarList.items.forEach(car => {

      if(car.vin === vin)[
        carfin = car
      ]
      
    })
    return carfin;

  }
 
  async updateCarCatalogue(){
    const { token } = await this.loginToSAD()
    const deletedRecords = await this.repository.deleteMany({})
    Logger.debug(`Deleted ${deletedRecords.affected} records`)
    let newCarsArray : NewCar[] = []
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
      27, // KIA Obregó
      28, // JAC Cualiacán
    ]
    let promises = []
    try {
      for(let id of agencyIds) {
        promises.push(this.httpService.get<{success: boolean, message: string, data: SADNewCar[]}>(
          `${this.sadApiConfig.baseUrl}/Vehicles?dealerId=${id}`,
          {
            headers: {
              'Authorization': 'Bearer ' + token.trim()
            }
          }
          ).toPromise()
        )
      }
      const responses = await Promise.all(promises)
      
      for(let response of responses) {
          if(response.data.success) {
            const sadNewCars = response.data.data as SADNewCar[]
            
            for(let sc of sadNewCars) {
              if(sc.isAvailable === 'S' && sc.isReserved === 'N') {

                let MetaDescription: string;
                let h1: string;

                if(sc.chassisType === 'S U V' || sc.chassisType === 'SUV')
                {
                  MetaDescription = 'Compra tu Camioneta '+sc.brand+' Nueva '+ sc.model.split(' ')[0]+' nuevo de agencia. Solicitalo en linea desde cualquier lugar de mexico. 20 años de experiencia nos avalan. ¡Estrena tu auto ya!';
                  h1 =  'Camioneta Nuevo ' + sc.brand + ' ' + sc.model + ' ' + sc.year; 
                }
                else if(sc.chassisType === 'PICK-UP')
                {
                  MetaDescription = 'Compra tu pickup '+ sc.model.split(' ')[0]+' nueva de agencia. Solicitalo en linea desde cualquier lugar de mexico. 20 años de experiencia nos avalan. ¡Estrena tu auto ya!';
                  h1 =  'Pickup Nuevo ' + sc.brand + ' ' + sc.model + ' ' + sc.year; 
                }
                else if(sc.chassisType === 'CHASIS CABINA'){
                  MetaDescription = 'Compra tu Camioneta '+sc.brand+' Nueva '+ sc.model.split(' ')[0]+' nuevo de agencia. Solicitalo en linea desde cualquier lugar de mexico. 20 años de experiencia nos avalan. ¡Estrena tu auto ya!';
                  h1 = 'Vehiculo de Carga Nuevo' + sc.brand + ' ' + sc.model + ' ' + sc.year;
                }
                else
                {
                  MetaDescription = 'Compra tu '+sc.brand+' '+ sc.model.split(' ')[0]+' nuevo de agencia. Solicitalo en linea desde cualquier lugar de mexico. 20 años de experiencia nos avalan. ¡Estrena tu auto ya!';
                  h1 =  'Auto Nuevo ' + sc.brand + ' ' + sc.model + ' ' + sc.year; 
                }
              //if(true) {
                let newCar: NewCar = {
                  vin: sc.ID,
                  agencyId: sc.agencyID.toString(),
                  brand: sc.brand,
                  model: sc.model,
                  series: sc.version,
                  chassisType: sc.chassisType,
                  metaTitulo: ''+sc.brand+ ' ' +sc.model.split(' ')[0]+ ' '+sc.year+' Nuevo En Linea | Estrena tu Auto',
                  metaDescription: MetaDescription,
                  h1Title: h1,
                  brandUrl: NewCarHelps.stringToUrl(sc.brand),
                  modelUrl: NewCarHelps.stringToUrl(sc.model),
                  seriesUrl: NewCarHelps.stringToUrl(sc.version),
                  price: +sc.price,
                  year: sc.year,
                  images: !sc.images ? []: sc.images.map(i => i.imageUrl),
                  transmision: sc.transmision,
                  fuel: sc.fuelType,
                  colours: sc.color,
                  baseColour: NewCarHelps.getBaseColour(sc.color),
                  specs: sc.specs
                }
                newCarsArray.push(newCar)
              }
            }
        }
      }
      const createdCars = await this.repository.createMany(newCarsArray)
      return {
        count: newCarsArray.length,
        results:createdCars
      }
    }
    catch(err) {
      Logger.error(err)
      throw err
    }
    finally {
      Logger.debug(`Inserted ${newCarsArray.length} records`)
    }
  }

  getCarCatalogue(authHeader: string) {
    if(authHeader === "automaticupdate") {
      this.updateCarCatalogue();
    }
    else if(authHeader !== this.setupCarsSecret){

      throw new UnauthorizedException()
    }
    else{
      this.updateCarCatalogue();
    }
    
   
  }

  private async loginToSAD(): Promise<{token: string}> {
    const response = await this.httpService.post(`${this.sadApiConfig.baseUrl}/login/authenticate`, {
      userName: this.sadApiConfig.username,
      password: this.sadApiConfig.password
    }).toPromise()
    return { token: response.data }
  }


};
