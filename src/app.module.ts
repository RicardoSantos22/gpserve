import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { resolve } from 'path';

import { mongoFactory } from './config/database.config';

import { AdminModule } from './tables/admin/admin.module';
import { AgencyModule } from './tables/agency/agency.module';
import { CreditRequestModule } from './tables/creditrequest/creditrequest.module';
import { GuestModule } from './tables/guest/guest.module';
import { InspectionAppointmentModule } from './tables/inspectionappointment/inspectionappointment.module';
import { InsuranceRequestsModule } from './tables/insurancerequests/insurancerequests.module';
import { NewCarModule } from './tables/newcar/newcar.module';
import { ReservationsModule } from './tables/reservations/reservations.module';
import { TestDriveAppointmentsModule } from './tables/testdriveappointments/testdriveappointments.module';
import { UsedCarModule } from './tables/usedcar/usercar.module';
import { UserModule } from './tables/user/user.module';

@Module({
  imports: [
    ConfigModule.load(resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),

    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mongoFactory,
      inject: [ConfigService],
    }),

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
  ]
})

export class AppModule {}
