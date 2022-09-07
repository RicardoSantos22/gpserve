import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';
import { Agency } from '../../agency/model/agency.model';
import { NewCar } from '../../newcar/model/newcar.model';

import { userType, carType } from '../../shared/enums';
import { User } from '../../user/model/user.model';

@modelOptions({
  schemaOptions: { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})

export class CreditRequest {
  constructor(data?: any) {
    Object.assign(this, data);
  }

  @ApiProperty({
    description: 'The car ID attached to this model',
    readOnly: true,
  })

  // @prop({ required: true, ref: 'NewCar' })
  // carId: Ref<NewCar>;

  @prop()
  carId: string

  @prop()
  asesorid: string

  @prop({
    ref: NewCar,
    foreignField: '_id',
    localField: 'carId',
    justOne: true
  })
  car: Ref<NewCar>

  @ApiProperty({
    description: 'The agency ID attached to this model',
    readOnly: true,
  })

  @prop({ required: true, ref: () => Agency })
  agencyId: Ref<Agency>;

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
    description: 'The user ID attached to this model',
    readOnly: true,
  })

  @prop({ required: true, ref: () => User  })
  userId: Ref<User>;

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
