import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { InitialAssessment } from './model/initial-assessment.model';
import {  InitialAssessmentController} from './controller/initial-assessment.controller';
import { InitialAssessmentService } from './service/initial-assessment.service'
import { InitialAssessmentRepository } from './repository/initial-assessment.repository';

@Module({
  imports: [TypegooseModule.forFeature([InitialAssessment])],
  controllers: [InitialAssessmentController],
  providers: [InitialAssessmentService, InitialAssessmentRepository],
  exports: [InitialAssessmentService, InitialAssessmentRepository, InitialAssessmentModule]
})

export class InitialAssessmentModule {}
