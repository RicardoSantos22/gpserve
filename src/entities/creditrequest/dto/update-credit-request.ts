import { PartialType } from '@nestjs/swagger';

import { CreateCreditRequestDTO } from './create-credit-request';

export class UpdateCreditRequestDTO extends PartialType(CreateCreditRequestDTO) {};
