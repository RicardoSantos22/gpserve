import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class NewCarService extends CrudService<NewCar> {

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
  }

  async findAll(query: FindAllNewCarsQuery): Promise<PaginatedEntities<NewCar>> {
    const cars = await this.repository.findAll(query)
    const groupedCars = NewCarHelps.groupCarsByHash(cars.items)
    return {
      ...cars,
      items: groupedCars
    }
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

  async getCarCatalogue() {
    const { token } = await this.loginToSAD()
    let newCarsArray : NewCar[] = []
    let agencyIds = [
      // 3, // Hyundai (Pruebas)
      12 // Chevrolet Culiacán
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
              let newCar: NewCar = {
                _id: sc.ID,
                agencyId: sc.agencyID.toString(),
                brand: sc.brand,
                model: sc.model,
                series: sc.version,
                brandUrl: NewCarHelps.stringToUrl(sc.brand),
                modelUrl: NewCarHelps.stringToUrl(sc.model),
                seriesUrl: NewCarHelps.stringToUrl(sc.version),
                price: +sc.price,
                year: sc.year,
                images: !sc.images ? []: sc.images.map(i => i.imageUrl),
                transmision: sc.transmision,
                fuel: sc.fuelType,
                colours: sc.color,
              }
              newCarsArray.push(newCar)
            }
        }
      }
      return this.repository.createMany(newCarsArray)
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
