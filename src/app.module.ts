import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { resolve } from 'path';

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
import { UsedCarModule } from './entities/usedcar/usercar.module';
import { UserModule } from './entities/user/user.module';

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
