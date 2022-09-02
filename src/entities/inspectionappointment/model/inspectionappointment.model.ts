import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop, Severity } from '@typegoose/typegoose';

import { requestStatus, userType } from '../../shared/enums';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: Severity.ALLOW
  }
})

export class InspectionAppointment {
  constructor(data?: any) {
    Object.assign(this, data);
  }

  @ApiProperty({
    description: "The model's identifier",
    readOnly: true,
  })

  @prop()
  id: string;

  @ApiProperty({
    description: 'The ID of the user making the appointment',
    readOnly: true,
  })

  @prop()
  userId: string;

  @ApiProperty({
    description: 'The ID of the agency attached to the appointment',
    readOnly: true,
  })

  @prop()
  agencyId: number;

  @ApiProperty({
    description: 'The information of the car',
    readOnly: true,
  })

  @prop()
  carInfo: object;

  @ApiProperty({
    description: 'The date of the appointment',
    readOnly: true,
  })

  @prop()
  scheduledDate: Date;

  @ApiProperty({
    description: 'The guest ID attached to this model',
    readOnly: true,
  })

  @prop()
  guestId: string;

  @ApiProperty({
    description: 'The type of user; either Guest or User',
    readOnly: true,
  })

  @prop()
  userType: userType;

  @ApiProperty({
    description: 'The status of the appointment',
    readOnly: true,
  })

  @prop()
  status: requestStatus;

  @ApiProperty({
    description: 'Attached comments',
    readOnly: true,
  })

  @prop()
  comments: string[];
}
