import { Injectable } from '@nestjs/common';

import { CrudService } from '../../../common/crud/crud.service';

import { UsedCar } from '../model/usedcar.model';

@Injectable()
export class UsedCarService extends CrudService<UsedCar> {}
