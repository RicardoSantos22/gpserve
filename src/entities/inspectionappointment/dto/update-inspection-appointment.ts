import { PartialType } from '@nestjs/swagger';

import { CreateInspectionAppointmentDTO } from './create-inspection-appointment';

export class UpdateInspectionAppointmentDTO extends PartialType(CreateInspectionAppointmentDTO) {};
