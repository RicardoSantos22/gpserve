import { PartialType } from '@nestjs/swagger';

import { CreateInsuranceRequestDTO } from './create-insurancerequest';

export class UpdateInsuranceRequestDTO extends PartialType(CreateInsuranceRequestDTO) {};
