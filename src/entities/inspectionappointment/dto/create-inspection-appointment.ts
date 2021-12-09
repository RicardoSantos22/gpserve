import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsObject,
  IsDate,
  IsIn,
} from 'class-validator';

import { userType } from '../../../entities/shared/enums';

export class CreateInspectionAppointmentDTO {
  @ApiProperty({
    description: 'The ID of the user making the appointment',
    example: '001',
  })

  @IsString()
  @IsNotEmpty()

  readonly userId: string;

  @ApiProperty({
    description: 'The ID of the agency attached to the appointment',
    example: 3,
  })

  @IsString()
  @IsNotEmpty()

  readonly agencyId: number;

  @ApiProperty({ description: 'The information of the car' })

  @IsObject()

  readonly carInfo: object;

  @ApiProperty({ description: 'The date of the appointment' })

  @IsDate()

  readonly scheduledDate: Date;

  @ApiProperty({
    description: 'The guest ID attached to this model',
    example: '002',
  })

  @IsString()

  readonly guestId: string;

  @ApiProperty({
    description: 'The type of user; either Guest or User',
    example: 'Guest',
  })

  @IsIn(Object.values(userType))

  readonly userType: userType;

  @ApiProperty({
    description: 'The status of the appointment',
    example: 'In Progess',
  })

  @IsString()

  readonly status: string;

  @ApiProperty({
    description: 'Attached comments',
    example: ['Comment 1', 'Comment 2'],
  })

  @IsArray()

  readonly comments: string[];
};
