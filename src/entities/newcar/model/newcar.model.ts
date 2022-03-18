import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop, Severity } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: Severity.ALLOW
  }
})

export class NewCar {
  constructor(data?: any) {
    Object.assign(this, data);
  }

  @ApiProperty({
    description: "The model's identifier",
    readOnly: true,
  })

  @prop()
  _id: string;

  @ApiProperty({
    description: 'The agency ID attached to this model',
    readOnly: true,
  })

  @prop()
  agencyId: string;

  @ApiProperty({
    description: "The car's brand",
    readOnly: true,
  })

  @prop()
  brand: string;

  @prop()
  brandUrl: string

  @ApiProperty({
    description: "The car's model",
    readOnly: true,
  })

  @prop()
  model: string;

  @prop()
  modelUrl: string

  @ApiProperty({
    description: "The car's series",
    readOnly: true,
  })
  @prop()
  series: string;

  @prop()
  seriesUrl: string

  @ApiProperty({
    description: "The car's price",
    readOnly: true,
  })
  @prop()
  price: string;

  @ApiProperty({
    description: "The car's manufacturing year",
    readOnly: true,
  })
  @prop()
  year: string;

  @ApiProperty({
    description: "The car's transmision type",
    readOnly: true,
  })
  @prop()
  transmision: any;

  @ApiProperty({
    description: "The car's fuel type",
    readOnly: true,
  })
  @prop()
  fuel: string;

  @ApiProperty({
    description: "The car's colour",
    readOnly: true,
  })
  @prop()
  colours: string | string[];
}
