import { Injectable } from '@nestjs/common';

import { CrudService } from '../../../common/crud/crud.service';

import { TestDriveAppointments } from '../models/testdriveappointments.model';

@Injectable()
export class TestDriveAppointmentsService extends CrudService<TestDriveAppointments> {}
