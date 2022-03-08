import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CrudService } from '../../../common/crud/crud.service';

import { User } from '../model/user.model';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UserService extends CrudService<User> {
  constructor(
    readonly repository: UserRepository,
    readonly config: ConfigService,
  ) {
    super(repository, 'User', config);
  }
}
