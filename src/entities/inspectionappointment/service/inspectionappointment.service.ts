import { Injectable } from '@nestjs/common';
import { ConfigService } from 'nestjs-config';

import { CrudService } from '../../../common/crud/crud.service';

import { InspectionAppointment } from '../model/inspectionappointment.model';
import { InspectionAppointmentRepository } from '../repository/inspectionappointment.repository';

@Injectable()
export class InspectionAppointmentService extends CrudService<InspectionAppointment> {
  constructor(
    readonly repository: InspectionAppointmentRepository,
    readonly config: ConfigService,
  ) {
    super(repository, 'InspectionAppointment', config);
  }
};
