import { Injectable } from '@nestjs/common';

import { CrudService } from '../../../common/crud/crud.service';

import { Admin } from '../model/admin.model';

@Injectable()
export class AdminService extends CrudService<Admin> {}
