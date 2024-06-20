import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import configuration from './config/configuration';
import { mongoFactory } from './config/database.config';
import { AdminModule } from './entities/admin/admin.module';
import { AgencyModule } from './entities/agency/agency.module';
import { CreditRequestModule } from './entities/creditrequest/creditrequest.module';
import { GuestModule } from './entities/guest/guest.module';
import { InspectionAppointmentModule } from './entities/inspectionappointment/inspectionappointment.module';
import { InsuranceRequestsModule } from './entities/insurancerequests/insurancerequests.module';
import { NewCarModule } from './entities/newcar/newcar.module';
import { ReservationsModule } from './entities/reservations/reservations.module';
import { TestDriveAppointmentsModule } from './entities/testdriveappointments/testdriveappointments.module';
import { UsedCarModule } from './entities/usedcar/usedcar.module';
import { UserModule } from './entities/user/user.module';
import { AuthModule } from './auth/auth.module';
import { LibroazulModule } from './entities/libroazul/libroazul.module';
import { CarSaleRequestModule } from './entities/carsalerequest/carsalerequest.module';
import { NoteModule } from './entities/note/note.module';

import { AsesoresModule } from './entities/asesores/asesores.module';
import { OrderModule } from './entities/order/order.module';
import { InitialAssessmentModule } from './entities/initialassessment/initial-assessment.module';
import { FinishedcarsModule } from './entities/finishedcars/finishedcars.module';
import { BugsModule } from './entities/bugs/bugs.module';
import { RecursosModule } from './entities/recursos/recursos.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mongoFactory,
      inject: [ConfigService],
    }),
    OrderModule,
    InitialAssessmentModule,
    AdminModule,
    AgencyModule,
    CreditRequestModule,
    GuestModule,
    InspectionAppointmentModule,
    InsuranceRequestsModule,
    NewCarModule,
    ReservationsModule,
    TestDriveAppointmentsModule,
    UsedCarModule,
    UserModule,
    AuthModule,
    LibroazulModule,
    CarSaleRequestModule,
    NoteModule,
    AsesoresModule,
    FinishedcarsModule,
    BugsModule,
    RecursosModule,
  ],
})

export class AppModule {}
