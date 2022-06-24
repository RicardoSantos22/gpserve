import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop, Severity } from '@typegoose/typegoose';

import { userType, carType } from '../../shared/enums';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: Severity.ALLOW
  }
})

export class CreditRequest {
  constructor(data?: any) {
    Object.assign(this, data);
  }

  @ApiProperty({
    description: 'The social URLs of the Agencies',
    readOnly: true,
  })

  @prop()
  webUrls: {
    id: string,
    url: string
  }[];

  @ApiProperty({
    description: 'The car ID attached to this model',
    readOnly: true,
  })

  @prop()
  carId: string;

  @ApiProperty({
    description: 'The current down payment of the vehicle',
    readOnly: true,
  })

  @prop()
  downPayment: number;

  @ApiProperty({
    description: 'THe time in months that the credit needs to be payed',
    readOnly: true,
  })

  @prop()
  creditMonths: number;

  @ApiProperty({
    description: 'The Guest ID attached to this model',
    readOnly: true,
  })

  @prop()
  guestId: string;

  @ApiProperty({
    description: 'The type of car; either New or Used',
    readOnly: true,
  })

  @prop()
  carType: carType;

  @ApiProperty({
    description: 'The type of user; either Guest or User',
    readOnly: true,
  })

  @prop()
  userType: userType;

  @ApiProperty({
    description: 'Is the user trading a car?',
    readOnly: true,
  })

  @prop()
  hasTradedCar: boolean;

  @ApiProperty({
    description: 'The value of the traded car if any',
    readOnly: true,
  })

  @prop()
  tradedCarValue?: number;
}
