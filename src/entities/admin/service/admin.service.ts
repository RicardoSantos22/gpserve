import { Injectable } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';

import { CrudService } from '../../../common/crud/crud.service';

import { Admin } from '../model/admin.model';
import { AdminRepository } from '../repository/admin.repository';

@Injectable()
export class AdminService extends CrudService<Admin> {
  constructor(
    readonly repository: AdminRepository,
    readonly config: ConfigService,
  ) {
    super(repository, 'Admin', config);
  }
};
