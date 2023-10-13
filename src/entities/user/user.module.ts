import { User } from './model/user.model';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserRepository } from './repository/user.repository';

import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { BucketModule } from '../../bucket/bucket.module';
import { CreditRequestModule } from '../creditrequest/creditrequest.module';
import { InsuranceRequestsModule } from '../insurancerequests/insurancerequests.module';
import { NewCarModule } from '../newcar/newcar.module';
import { UsedCarModule } from '../usedcar/usedcar.module';
import { TestDriveAppointmentsModule } from '../testdriveappointments/testdriveappointments.module';
import { OrderModule } from '../order/order.module';
import { InspectionAppointmentModule } from '../inspectionappointment/inspectionappointment.module';
import { AgencyModule } from '../agency/agency.module';
import { InitialAssessmentModule } from '../initialassessment/initial-assessment.module';
import { InitialAssessmentService } from '../initialassessment/service/initial-assessment.service';
import { InitialAssessmentRepository } from '../initialassessment/repository/initial-assessment.repository';

@Module({
  imports: [
    TypegooseModule.forFeature([User]),
    BucketModule,
    CreditRequestModule,
    InsuranceRequestsModule,
    NewCarModule,
    UsedCarModule,
    TestDriveAppointmentsModule,
    OrderModule,
    AgencyModule,
    InspectionAppointmentModule,
    InitialAssessmentModule,
     InitialAssessmentModule
  ],
  controllers: [UserController],
  providers: [UserService,
     UserRepository, 
     CreditRequestModule, 
     InsuranceRequestsModule,
    NewCarModule,
    UsedCarModule, 
    TestDriveAppointmentsModule, 
    OrderModule, 
    InspectionAppointmentModule,
    AgencyModule],

  exports: [UserService]
})

export class UserModule {}
