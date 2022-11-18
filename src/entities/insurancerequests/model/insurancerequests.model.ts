import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop, Severity } from '@typegoose/typegoose';

import { userType, carType } from '../../shared/enums';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: Severity.ALLOW
  }
})

export class InsuranceRequests {
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
    description: 'The user ID attached to this model',
  })

  @prop()
  asesorid: string;


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
    description: 'The preferred broker for the request',
    readOnly: true,
  })

  @prop()
  preferredBroker: string;

  @ApiProperty({
    description: 'The type of car; either New or Used',
    readOnly: true,
  })

  @prop()
  carType: carType;

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
    description: 'The current status of the appointment',
    readOnly: true,
  })

  @prop()
  status: string
}
