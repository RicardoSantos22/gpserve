import { modelOptions, prop, Ref, Severity } from '@typegoose/typegoose';


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

export class CarSaleRequest {
  constructor(data?: any) {
    Object.assign(this, data);
  }

  @prop()
  make: string

  @prop()
  model: string

  @prop()
  version: string

  @prop()
  year: number

  @prop()
  value: number

  @prop()
  kms: string

  @prop()
  transmission: string

  @prop()
  carCondition: string

  @prop()
  state: string

  @prop()
  sellingPurpose: string

  @prop()
  colour: string

  @prop()
  name: string

  @prop()
  email: string

  @prop()
  phoneNumber: string

}
