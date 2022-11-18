import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CrudService } from '../../../common/crud/crud.service';

import { TestDriveAppointments } from '../models/testdriveappointments.model';
import { TestDriveAppointmentRepository } from '../repository/testdriveappointment.repository';

@Injectable()
export class TestDriveAppointmentsService extends CrudService<TestDriveAppointments> {
  constructor(
    readonly repository: TestDriveAppointmentRepository,
    readonly config: ConfigService,
  ) {
    super(repository, 'TestDrivenAppointment', config);
  }
};
