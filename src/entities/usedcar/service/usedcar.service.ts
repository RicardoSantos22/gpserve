import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CrudService } from '../../../common/crud/crud.service';
import { NewCarsFilters } from '../../newcar/dto/new-cars-filters';
import { SADUsedCar } from '../entities/sad-used-car';
import { UsedCar } from '../model/usedcar.model';
import { UsedCarRepository } from '../repository/usedcar.repository';

@Injectable()
export class UsedCarService extends CrudService<UsedCar> {

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

  async getUsedCarCatalogue() {
    const { token } = await this.loginToSAD()
    let usedCarArrays : UsedCar[] = []
    try {
      const response = await this.httpService.get<{success: boolean, message: string, data: SADUsedCar[]}>(
        `${this.sadApiConfig.baseUrl}/Vehicles/Used?dealerId=12`,
         {
          headers: {
            'Authorization': 'Bearer ' + token.trim()
          }
        }
        ).toPromise()
        if(response.data.success) {
          const sadNewCars = response.data.data
          for(let sc of sadNewCars) {
            let usedCar: UsedCar = {
              _id: sc.ID,
              agencyId: sc.agencyID.toString(),
              brand: sc.brand,
              model: sc.model,
              series: sc.version,
              price: sc.price,
              year: sc.year,
              images: [],
              transmision: sc.transmision,
              fuel: sc.fuelType,
              colours: sc.color,
              km: +sc.kmCount,
              location: sc.agencyCity
            }
            usedCarArrays.push(usedCar)
          }
          return this.repository.createMany(usedCarArrays)
        }
    }
    catch(err) {
      Logger.error(err)
      throw err
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
