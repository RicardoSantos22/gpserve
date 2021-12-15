import { PartialType } from '@nestjs/swagger';

import { CreateNewCarDTO } from './create-newcar';

export class UpdateNewCarDTO extends PartialType(CreateNewCarDTO) {};
