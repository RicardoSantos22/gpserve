import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsObject,
  IsIn,
  IsEnum,
  IsDateString,
  IsNumber,
  IsBoolean,
} from 'class-validator';

import { requestStatus, userType } from '../../shared/enums';

export class CreateInitialAssessmentDTO {
  @ApiProperty({
    description: "The car's brand",
    example: 'Baic',
  })

  @IsString()
  @IsNotEmpty()

  readonly brand: string;

  @ApiProperty({
    description: "The car's model",
    example: 'VIGUS',
  })

  @IsString()
  @IsNotEmpty()

  readonly model: string;

  @ApiProperty({
    description: "The car's version",
    example: '4p GL L4/1.8/T Man',
  })

  @IsString()
  @IsNotEmpty()

  readonly version: string;


  @ApiProperty({
    description: "The car's year",
    example: '2022',
  })

  @IsString()
  @IsNotEmpty()

  readonly year: string;

  @ApiProperty({
    description: "The car's transmision type",
    example: 'Manual',
  })

  @IsString()
  @IsNotEmpty()

  readonly transmision: string;

  @ApiProperty({
    description: "The car's kilometers",
    example: '0-10,000',
  })

  @IsString()
  @IsNotEmpty()

  readonly km: string;

  @ApiProperty({
    description: "The car's kilometers",
    example: '0-10,000',
  })

  @IsString()
  @IsNotEmpty()

  readonly colour: string;

  @ApiProperty({
    description: "The car has an inspection",
  })
  @IsBoolean()
  @IsNotEmpty()

  readonly hasInspectionScheduled: boolean;
  
  @ApiProperty({
    description: "The inspection appointment id",
    readOnly: true,
  })
  inspectionAppointmentId: string;
};
