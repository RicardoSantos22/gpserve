import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';


import { userType, carType, requestStatus } from '../../shared/enums';


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

export class order {
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
  carid: string

  @prop()
  userId: string;

  @prop()
  agencyId: string;

  @prop()
  hmac: string;

  @prop()
  status: string;

  @prop()
  Norder: number;

  @prop()
  Nreferencia: number;

  @prop()
  amount: number;

  @prop()
  concept: number;

  @prop()
  commerceName: string;

  @prop()
  method: string;

  


}
