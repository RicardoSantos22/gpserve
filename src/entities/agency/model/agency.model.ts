import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: { timestamps: true }
})

export class Agency {
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
    description: 'The state of the Agency',
    readOnly: true,
  })

  @prop()
  state: string;

  @ApiProperty({
    description: 'The location of the agency',
    readOnly: true,
  })

  @prop()
  location: any;

  @ApiProperty({
    description: "The map's reference for the Agency",
    readOnly: true,
  })

  @prop()
  mapImage: string;

  @ApiProperty({
    description: 'The list of permissions for the Administrators',
    readOnly: true,
  })

  @prop()
  permissions: string[];

  @ApiProperty({
    description: 'The number of the Agency',
    readOnly: true,
  })

  @prop()
  number: number;

  @ApiProperty({
    description: 'The email of the Agency',
    readOnly: true,
  })

  @prop()
  email: string;

  @ApiProperty({
    description: 'The availability of the Agency for inspections',
    readOnly: true,
  })

  @prop()
  inspectionHours: {
    start: string,
    end: string,
  };

  @ApiProperty({
    description: 'The available brands in the Agency',
    readOnly: true,
  })

  @prop()
  brands: string[];

  @ApiProperty({
    description: 'The name of the Agency',
    readOnly: true,
  })

  @prop()
  name: string;

  @ApiProperty({
    description: 'Social URLs associated with the Agency',
    readOnly: true,
  })

  @prop()
  webUrls: {
    id: string,
    urls: string[],
  }
}
