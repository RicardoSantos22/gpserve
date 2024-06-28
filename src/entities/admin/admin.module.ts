import { Admin } from './model/admin.model';
import { AdminController } from './controller/admin.controller';
import { AdminService } from './service/admin.service';
import { AdminRepository } from './repository/admin.repository';
import { UserModule } from '../user/user.module';

import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { PassportModule } from '@nestjs/passport';
import { NewCarModule } from '../newcar/newcar.module';
import { UsedCarModule } from '../usedcar/usedcar.module';
import { BucketModule } from '../../bucket/bucket.module';
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
