import { UserModule } from '../user/user.module';
import { AdminController } from './controller/admin.controller';
import { Admin } from './model/admin.model';
import { AdminRepository } from './repository/admin.repository';
import { AdminService } from './service/admin.service';

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypegooseModule } from 'nestjs-typegoose';
import { BucketModule } from '../../bucket/bucket.module';
import { NewCarModule } from '../newcar/newcar.module';
import { UsedCarModule } from '../usedcar/usedcar.module';
import { banners } from './model/banners.model';
import { bannersrepository } from './repository/banners.repository';
import { CreditRequestModule } from '../creditrequest/creditrequest.module';
import { AsesoresModule } from '../asesores/asesores.module';
import { RecursosModule } from '../recursos/recursos.module';
import { FinishedcarsModule } from '../finishedcars/finishedcars.module';

@Module({
  imports: [
    NewCarModule,
    UsedCarModule,
    
    UserModule,
    FinishedcarsModule,
    PassportModule,
    TypegooseModule.forFeature([Admin, banners]),
    BucketModule,

    CreditRequestModule,
    FinishedcarsModule,
    RecursosModule,
    AsesoresModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository, bannersrepository],
})
export class AdminModule {}
