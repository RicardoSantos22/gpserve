import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateTestDriveAppointmentDTO {

  @ApiProperty({
    description: 'The user ID attached to this model',
    example: '001',
  })
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

   asesorid: string;

  @ApiProperty({
    description: 'The agency ID attached to this model',
    example: '002',
  })
  @IsString()
  @IsNotEmpty()
  readonly agencyId: string;

  @ApiProperty({
    description: 'The car ID attached to this model',
    example: '003',
  })
  @IsString()
  @IsNotEmpty()
  readonly carId: string;

  @ApiProperty({ description: 'The scheduled date for the drive test appointment' })
  @IsDateString()
  @IsOptional()
  readonly scheduledDate: Date;

  @ApiProperty({ description: 'The scheduled hours for the drive test appointment' })
  @IsNumber()
  @IsOptional()
  readonly scheduledHours: string;

  @IsNumber()
  readonly timestamp: number;

  @ApiProperty({
    description: 'The current status of the appointment',
    example: 'In Progress',
  })
  @IsString()
  @IsOptional()
  readonly status: string

  @ApiProperty({
    description: 'Attached comments',
    example: ['Some comment 1', 'Some comment 2'],
  })
  @IsArray()
  @IsOptional()
  readonly comments: string[];
};
