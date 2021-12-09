import { PartialType } from '@nestjs/swagger';

import { CreateAgencyDTO } from './create-agency';

export class UpdateAgencyDTO extends PartialType(CreateAgencyDTO) {};
