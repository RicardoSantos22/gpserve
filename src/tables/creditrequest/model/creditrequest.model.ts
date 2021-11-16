import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { timestamps: true }
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
  string: string;

  @ApiProperty({
    description: 'The type of car; either New or Used',
    readOnly: true,
  })

  @prop()
  carType: 'New' | 'Used'

  @ApiProperty({
    description: 'The type of user; either Guest or User',
    readOnly: true,
  })

  @prop()
  userType: 'Guest' | 'User';

  @ApiProperty({
    description: 'Is the user trading a car?',
    readOnly: true,
  })

  @prop()
  hasTradedCar?: boolean;

  @ApiProperty({
    description: 'The value of the traded car if any',
    readOnly: true,
  })

  @prop()
  tradedCarValue?: number;
}
