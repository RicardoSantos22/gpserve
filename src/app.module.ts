import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { resolve } from 'path';

import { mongoFactory } from './config/database.config';

import { AdminModule } from './tables/admin/admin.module';
import { GuestModule } from './tables/guest/guest.module';
import { InsuranceRequestsModule } from './tables/insurancerequests/insurancerequests.module';
import { ReservationsModule } from './tables/reservations/reservations.module';
import { TestDriveAppointmentsModule } from './tables/testdriveappointments/testdriveappointments.module';
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
    GuestModule,
    InsuranceRequestsModule,
    ReservationsModule,
    TestDriveAppointmentsModule,
    UserModule,
  ]
})

export class AppModule {}
