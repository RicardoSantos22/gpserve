import { Severity, modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class banners {
  constructor(data?: any) {
    Object.assign(this, data);
  }

  @prop()
  imgurl: string;

  @prop()
  vinculo: string;

  @prop()
  isactive: boolean;

  @prop()
  type: string;

  @prop()
  banner: string;
}
