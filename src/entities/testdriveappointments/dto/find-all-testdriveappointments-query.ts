import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { CreateTestDriveAppointmentDTO } from './create-testdriveappointment';

import { FindAllQuery } from '../../../common/models/dto/query/find-all-query.dto';

export class FindAllTestDriveAppointmentsQuery extends PartialType(FindAllQuery) implements Partial<CreateTestDriveAppointmentDTO> {
  id: any;

  @ApiProperty({
    description: 'The user ID attached to this model',
    example: '001',
    readOnly: true,
  })

  @IsOptional()

  userId: any;

  @ApiProperty({
    description: 'The agency ID attached to this model',
    example: '002',
    readOnly: true,
  })

  @IsOptional()

  agencyId: any;

  @ApiProperty({
    description: 'The car ID attached to this model',
    example: '003',
    readOnly: true,
  })

  @IsOptional()

  carId: any;

  @ApiProperty({
    description: 'The scheduled date for the drive test appointment',
    readOnly: true,
  })

  @IsOptional()

  scheduledDate: any;

  @ApiProperty({
    description: 'The current status of the appointment',
    example: 'In Progress',
    readOnly: true,
  })

  @IsOptional()

  status: any;

  @ApiProperty({
    description: 'Attached comments',
    example: ['Some comment 1', 'Some comment 2'],
    readOnly: true,
  })

  @IsOptional()

  comments: any;
};
