import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop, Severity } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: Severity.ALLOW
  }
})

export class Car {
  constructor(data?: any) {
    Object.assign(this, data);
  }

  @ApiProperty({
    description: "The model's identifier",
    readOnly: true,
  })

  @prop()
  id: string;

  @prop()
  vin: string

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
  chassisType: string;

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
  price: number;

  @ApiProperty({
    description: "online or offline status car",
    readOnly: true,
  })

  @prop()
  status: string;
  @ApiProperty({
    description: "The car's manufacturing year",
    readOnly: true,
  })
  @prop()
  year: string;

  @prop({default: []})
  images: string[]

  @prop({default: []})
  specs: { 
    spec: string,
    descriptionSpec: string,
    label?: string,
    category?: string
  }[]

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

  @prop()
  baseColour: string

  @ApiProperty({
    description: "The car's kilometers",
    readOnly: true,
  })
  @prop()
  km: number;

  @ApiProperty({
    description: "cartype new or others",
    readOnly: true,
  })
  @prop()
  cartype: string;
  
  @prop()
  other: any[]
  
}
