import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop, Severity } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: Severity.ALLOW
  }
})

export class Bug {
  constructor(data?: any) {
    Object.assign(this, data);
  }

  @prop()
  type: string;
  
  @prop()
  detalle: string;

  @prop()
  error: string;

  @prop() 
  notas: [];

  @prop()
  Iduser: string;

  @prop()
  Condiciones: string;
  

}
