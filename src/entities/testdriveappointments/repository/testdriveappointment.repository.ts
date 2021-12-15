import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { CrudRepository } from '../../../common/crud/crud.repository';

import { TestDriveAppointments } from '../models/testdriveappointments.model';

@Injectable()
export class TestDriveAppointmentRepository extends CrudRepository<TestDriveAppointments> {
  constructor(@InjectModel(TestDriveAppointments) readonly model: ReturnModelType<typeof TestDriveAppointments>) {
    super(model, 'TestDrivenAppointment');
  }
};
