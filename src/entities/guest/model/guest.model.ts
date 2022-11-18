import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop, Severity } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: Severity.ALLOW
  }
})

export class Guest {
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
    description: 'Name of the guest',
    readOnly: true,
  })

  @prop()
  name: string;

  @ApiProperty({
    description: 'Email of the guest',
    readOnly: true,
  })

  @prop()
  email: string;

  @ApiProperty({
    description: "The guest's phone; can be optional",
    readOnly: true,
  })

  @prop()
  phone?: string;
}
