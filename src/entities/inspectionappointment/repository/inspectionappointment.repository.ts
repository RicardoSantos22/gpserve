import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { CrudRepository } from '../../../common/crud/crud.repository';

import { InspectionAppointment } from '../model/inspectionappointment.model';

@Injectable()
export class InspectionAppointmentRepository extends CrudRepository<InspectionAppointment> {
  constructor(@InjectModel(InspectionAppointment) readonly model: ReturnModelType<typeof InspectionAppointment>) {
    super(model, 'InspectionAppointment');
  }
};
