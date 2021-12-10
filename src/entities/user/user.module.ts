import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { User } from './model/user.model';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [TypegooseModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})

export class UserModule {}
