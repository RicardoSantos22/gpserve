import { PartialType } from '@nestjs/swagger';

import { CreateGuestDTO } from './create-guest';

export class UpdateGuestDTO extends PartialType(CreateGuestDTO) {};
