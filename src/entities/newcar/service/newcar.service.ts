import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ConfigService } from 'nestjs-config';

import { CrudService } from '../../../common/crud/crud.service';
import { SADNewCar } from '../entities/sad-newcar';

import { NewCar } from '../model/newcar.model';
import { NewCarRepository } from '../repository/newcar.fepository';

@Injectable()
export class NewCarService extends CrudService<NewCar> {

  SAD_BASE_URL = ' http://201.116.249.45:1086/api/Vehicles'

  constructor(
    readonly repository: NewCarRepository,
    readonly config: ConfigService,
    private httpService: HttpService
  ) {
    super(repository, 'NewCar', config);
  }

  async getCarCatalogue() {
    let newCarsArray : NewCar[] = []
    const response = await this.httpService.get<{success: boolean, message: string, data: SADNewCar[]}>(`${this.SAD_BASE_URL}?dealerId=3`).toPromise()
    if(response.data.success) {
      const sadNewCars = response.data.data
      for(let sc of sadNewCars) {
        let newCar: NewCar = {
          _id: sc.ID,
          agencyId: sc.agencyID.toString(),
          brand: sc.brand,
          model: sc.model
        }
        newCarsArray.push(newCar)
      }
      return this.repository.createMany(newCarsArray)
    }
  }

};
