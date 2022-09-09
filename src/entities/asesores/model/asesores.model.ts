import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop, Severity } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Asesores {
  constructor(data?: any) {
    Object.assign(this, data);
  }

  @prop()
  nombre: string;

  @prop()
  dias: string[];

  @prop()
  guardia: string[];
}
