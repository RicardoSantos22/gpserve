import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop, Severity } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: Severity.ALLOW
  }
})

export class Note {
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
    description: "The note's message",
    readOnly: true,
  })

  @prop()
  message: string;

  @ApiProperty({
    description: "The request's identifier",
    readOnly: true,
  })

  @prop()
  requestId: string;

}
