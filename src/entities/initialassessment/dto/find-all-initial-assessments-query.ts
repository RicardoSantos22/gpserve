import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { CreateInitialAssessmentDTO } from './create-initial-assessment';

import { FindAllQuery } from '../../../common/models/dto/query/find-all-query.dto';

export class FindAllInitialAssessmentsQuery extends PartialType(FindAllQuery) implements Partial<CreateInitialAssessmentDTO> {
  @ApiProperty({
    description: "The car's brand",
    example: 'Baic',
  })

  @IsOptional()
  readonly brand: any;

  @ApiProperty({
    description: "The car's model",
    example: 'VIGUS',
  })

  @IsOptional()

  readonly model: any;

  @ApiProperty({
    description: "The car's version",
    example: '4p GL L4/1.8/T Man',
  })

  @IsOptional()

  readonly version: any;

  @ApiProperty({
    description: "The car's price",
    example: 367100,
  })

  @IsOptional()
  readonly price: any;

  @ApiProperty({
    description: "The car's year",
    example: '2022',
  })

  @IsOptional()

  readonly year: any;

  @ApiProperty({
    description: "The car's transmision type",
    example: 'Manual',
  })

  @IsOptional()

  readonly transmision: any;

  @ApiProperty({
    description: "The car's kilometers",
    example: '0-10,000',
  })

  @IsOptional()

  readonly km: any;

  @ApiProperty({
    description: "The car's kilometers",
    example: '0-10,000',
  })

  @IsOptional()

  readonly colour: any;

  @ApiProperty({
    description: "The car has an inspection",
  })
  readonly hasInspectionScheduled: any;

  @ApiProperty({
    description: "The inspection appointment id",
    readOnly: true,
  })
  inspectionAppointmentId: any;
}
