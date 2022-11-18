import { PartialType } from '@nestjs/swagger';

import { CreateInitialAssessmentDTO } from './create-initial-assessment';

export class UpdateInitialAssessmentDTO extends PartialType(CreateInitialAssessmentDTO) {};
