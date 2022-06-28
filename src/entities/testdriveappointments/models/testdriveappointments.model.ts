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

  // TODO: We are going to need to merge both scheduledDate and scheduledHours into a field that accepts Time UNIX entries for better hadnling of the selected time

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
