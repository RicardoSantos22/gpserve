import { Injectable } from '@nestjs/common';

import { CrudService } from '../../../common/crud/crud.service';

import { InspectionAppointment } from '../model/inspectionappointment.model';

@Injectable()
export class InspectionAppointmentService extends CrudService<InspectionAppointment> {}
