import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop } from '@typegoose/typegoose';

import { carType } from '../../shared/enums';

@modelOptions({
  schemaOptions: { timestamps: true }
})

export class Reservations {
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
    description: 'The type of car; either New or Used',
    readOnly: true,
  })

  @prop()
  carType: carType;

  @ApiProperty({
    description: "The payment's reference",
    readOnly: true,
  })

  @prop()
  paymentReference: string;

  @ApiProperty({
    description: 'The current status of the payment',
    readOnly: true,
  })

  @prop()
  status: string

  @ApiProperty({
    description: 'The response of the payment',
    readOnly: true,
  })

  @prop()
  paymentResponse: any;
}
