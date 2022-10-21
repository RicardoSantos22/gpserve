import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop, Severity } from '@typegoose/typegoose';

import { requestStatus, userType } from '../../shared/enums';

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: Severity.ALLOW
  }
})

export class InitialAssessment {
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
    description: "The car's brand",
    readOnly: true,
  })
  @prop({ required: true})
  brand: string;

  @ApiProperty({
    description: "The car's model",
    readOnly: true,
  })
  @prop({ required: true})
  model: string;

  @ApiProperty({
    description: "The car's version",
    readOnly: true,
  })
  @prop({ required: true})
  version: string;

  @ApiProperty({
    description: "The car's price",
    readOnly: true,
  })
  @prop({ required: true})
  price: number;

  @ApiProperty({
    description: "The car's manufacturing year",
    readOnly: true,
  })
  @prop({ required: true})
  year: string;

  @ApiProperty({
    description: "The car's transmision type",
    readOnly: true,
  })
  @prop({ required: true})
  transmision: string;

  @ApiProperty({
    description: "The car's kilometers",
    readOnly: true,
  })
  @prop({ required: true})
  km: string;


  @ApiProperty({
    description: "The car's colour",
    readOnly: true,
  })
  @prop({ required: true})
  colour: string;

  @ApiProperty({
    description: "The car has an inspection",
    readOnly: true,
  })
  @prop({ required: true})
  hasInspectionScheduled: boolean;

  @ApiProperty({
    description: "The inspection appointment id",
    readOnly: true,
  })
  @prop()
  inspectionAppointmentId: string;

}
