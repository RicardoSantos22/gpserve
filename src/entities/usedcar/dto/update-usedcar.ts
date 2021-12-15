import { PartialType } from '@nestjs/swagger';

import { CreateUsedCarDTO } from './create-usedcar';

export class UpdateUsedCarDTO extends PartialType(CreateUsedCarDTO) {};
