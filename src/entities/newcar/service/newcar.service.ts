import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CrudService } from '../../../common/crud/crud.service';
import { SADNewCar } from '../entities/sad-newcar';

import { NewCar } from '../model/newcar.model';
import { NewCarRepository } from '../repository/newcar.fepository';

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

  async getCarCatalogue() {
    const { token } = await this.loginToSAD()
    let newCarsArray : NewCar[] = []
    try {
      const response = await this.httpService.get<{success: boolean, message: string, data: SADNewCar[]}>(
        `${this.sadApiConfig.baseUrl}/Vehicles?dealerId=3`,
         {
          headers: {
            'Authorization': 'Bearer ' + token.trim()
          }
        }
        ).toPromise()
        if(response.data.success) {
          const sadNewCars = response.data.data
          for(let sc of sadNewCars) {
            let newCar: NewCar = {
              _id: sc.ID,
              agencyId: sc.agencyID.toString(),
              brand: sc.brand,
              model: sc.model,
              series: sc.version,
              price: sc.price,
              year: sc.year,
              transmision: sc.transmision,
              fuel: sc.fuelType,
              colours: sc.color,
            }
            newCarsArray.push(newCar)
          }
          return this.repository.createMany(newCarsArray)
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
