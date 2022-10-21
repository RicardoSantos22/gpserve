import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { InitialAssessment } from './model/initialassessment.model';
import {  InitialAssessmentController} from './controller/initialassessment.controller';
import { InitialAssessmentService } from './service/initialassessment.service'
import { InitialAssessmentRepository } from './repository/initialassessment.repository';

@Module({
  imports: [TypegooseModule.forFeature([InitialAssessment])],
  controllers: [InitialAssessmentController],
  providers: [InitialAssessmentService, InitialAssessmentRepository],
})

export class InitialAssessmentModule {}
