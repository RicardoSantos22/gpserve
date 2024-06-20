import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop, Severity } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: Severity.ALLOW
  }
})

export class recurso {
  constructor(data?: any) {
    Object.assign(this, data);
  }

  @prop()
  name: string

  @prop()
  value: string

  @prop()
  description: string

  @prop()
  date: Date
}
