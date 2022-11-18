import { PartialType } from '@nestjs/swagger';

import { CreateUserDTO } from './create-user';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {};
