import { PartialType, OmitType } from '@nestjs/swagger';

import { CreateCreditRequestDTO } from './create-credit-request';

export class UpdateCreditRequestDTO extends PartialType(OmitType(CreateCreditRequestDTO, ['agencyId'] as const)) {};
