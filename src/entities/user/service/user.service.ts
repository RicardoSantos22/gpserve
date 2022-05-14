import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CrudService } from '../../../common/crud/crud.service';
import { CreateUserDTO } from '../dto/create-user';

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

  async create(user: CreateUserDTO): Promise<User> {
    const exists = await this.findByEmailAndFirebaseId(user.firebaseId, user.email)
    if(exists) throw new BadRequestException('User with given email already exists')
    return this.repository.create(user)
  }

  async findByEmailAndFirebaseId(firebaseId: string, email: string): Promise<User> {
    return this.repository.findOne({firebaseId, email})
  }

}
