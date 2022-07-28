import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CrudService } from '../../../common/crud/crud.service';
import { NewCarsFilters } from '../../newcar/dto/new-cars-filters';
import { SADUsedCar } from '../entities/sad-used-car';
import { UsedCar } from '../model/usedcar.model';
import { UsedCarRepository } from '../repository/usedcar.repository';

@Injectable()
export class UsedCarService extends CrudService<UsedCar> {

  setupCarsSecret: string

  sadApiConfig = {
    baseUrl: null,
    username: null,
    password: null
  }

  constructor(
    readonly repository: UsedCarRepository,
    readonly config: ConfigService,
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
      if(car.transmision) sets.transmision.add(car.transmision)
      sets.colours.add(car.colours as string)
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

  async getUsedCarCatalogue(authHeader: string) {
    if(authHeader !== this.setupCarsSecret) throw new UnauthorizedException()
    const { token } = await this.loginToSAD()
    const deletedRecords = await this.repository.deleteMany({})
    Logger.debug(`Deleted ${deletedRecords.affected} records`)
    let usedCarsArray : UsedCar[] = []
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
    ]
    let promises = []
    try {
      for(let id of agencyIds) {
        promises.push(this.httpService.get<{success: boolean, message: string, data: SADUsedCar[]}>(
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
      for(let response of responses) {
        if(response.data.success) {
          const sadNewCars = response.data.data as SADUsedCar[]
          for(let sc of sadNewCars) {
            if(sc.isAvailable === 'S' && sc.isReserved === 'N') {
            //if(true) {
              let usedCar: UsedCar = {
                _id: sc.ID,
                agencyId: sc.agencyID.toString(),
                brand: sc.brand,
                model: sc.model,
                series: sc.version,
                price: sc.price,
                year: sc.year,
                images: !sc.images ? []: sc.images.map(i => i.imageUrl),
                transmision: sc.transmision,
                fuel: sc.fuelType,
                colours: sc.color,
                km: +sc.kmCount,
                location: sc.agencyCity,
                specs: sc.specs
              }
              usedCarsArray.push(usedCar)
            }
          }
        }
      }
      return this.repository.createMany(usedCarsArray)
    }
    catch(err) {
      Logger.error(err)
      throw err
    }
    finally {
      Logger.debug(`Inserted ${usedCarsArray.length} records`)
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
