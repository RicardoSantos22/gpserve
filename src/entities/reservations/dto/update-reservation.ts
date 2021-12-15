import { PartialType } from '@nestjs/swagger';

import { CreateReservationDTO } from './create-reservation';

export class UpdateReservationDTO extends PartialType(CreateReservationDTO) {};
