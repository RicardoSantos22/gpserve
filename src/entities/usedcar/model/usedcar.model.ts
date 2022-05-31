import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop, Severity } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: Severity.ALLOW
  }
})

export class UsedCar {
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

  @ApiProperty({
    description: "The car's model",
    readOnly: true,
  })
  @prop()
  model: string;

  @ApiProperty({
    description: "The car's series",
    readOnly: true,
  })
  @prop()
  series: string;

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

  @prop({default: []})
  images: string[];

  @ApiProperty({
    description: "The car's transmision type",
    readOnly: true,
  })
  @prop()
  transmision: any;

  @ApiProperty({
    description: "The car's kilometers",
    readOnly: true,
  })
  @prop()
  km: number;

  @ApiProperty({
    description: "The car's location",
    readOnly: true,
  })
  @prop()
  location: string;
  
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
