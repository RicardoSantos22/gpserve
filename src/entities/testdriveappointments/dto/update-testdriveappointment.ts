import { PartialType } from '@nestjs/swagger';

import { CreateTestDriveAppointmentDTO } from './create-testdriveappointment';

export class UpdateTestDriveAppointmentDTO extends PartialType(CreateTestDriveAppointmentDTO) {};
