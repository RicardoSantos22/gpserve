import { Injectable } from '@nestjs/common';

import { CrudService } from '../../../common/crud/crud.service';

import { NewCar } from '../model/newcar.model';

@Injectable()
export class NewCarService extends CrudService<NewCar> {}
