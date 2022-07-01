import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop, Severity } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: Severity.ALLOW
  }
})

export class TestDriveAppointments {
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
    description: 'The user ID attached to this model',
    readOnly: true,
  })

  @prop()
  userId: string;

  @ApiProperty({
    description: 'The agency ID attached to this model',
    readOnly: true,
  })

  @prop()
  agencyId: string;

  @ApiProperty({
    description: 'The car ID attached to this model',
    readOnly: true,
  })

  @prop()
  carId: string;

  @ApiProperty({
    description: 'The scheduled date for the drive test appointment',
    readOnly: true,
  })

  @prop()
  scheduledDate: Date;

  @ApiProperty({
    description: 'The scheduled hours for the drive test appointment',
    readOnly: true,
  })

  @prop()
  scheduledHours: string;

  @ApiProperty({
    description: 'Both the date and the hours registered in a UNIX date format',
    readOnly: true,
  })

  @prop()
  timestamp: number;

  @ApiProperty({
    description: 'The current status of the appointment',
    readOnly: true,
  })

  @prop()
  status: string

  @ApiProperty({
    description: 'Attached comments',
    readOnly: true,
  })

  @prop()
  comments: string[];
}
