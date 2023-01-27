import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateInspectionAppointmentDTO } from './create-inspection-appointment';

export class UpdateInspectionAppointmentDTO extends PartialType(OmitType(CreateInspectionAppointmentDTO,['initialAssessmentId'] as const)) {};