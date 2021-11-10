import { Injectable } from '@nestjs/common';

import { CrudService } from '../../../common/crud/crud.service';

import { User } from '../model/user.model';

@Injectable()
export class UserService extends CrudService<User> {}
