import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { CreateInspectionAppointmentDTO } from './create-inspection-appointment';

import { FindAllQuery } from '../../../common/models/dto/query/find-all-query.dto';

export class FindAllInspectionAppointmentsQuery extends PartialType(FindAllQuery) implements Partial<CreateInspectionAppointmentDTO> {
  id: any;

  @ApiProperty({
    description: 'The ID of the user making the appointment',
    example: '001',
    readOnly: true,
  })

  @IsOptional()

  userId: any;

  @ApiProperty({
    description: 'The ID of the agency attached to the appointment',
    example: 3,
    readOnly: true,
  })

  @IsOptional()

  agencyId: any;

  @ApiProperty({
    description: 'The information of the car',
    readOnly: true,
  })

  @IsOptional()

  initialAssessmentId: any;

  @ApiProperty({
    description: 'The date of the appointment',
    readOnly: true,
  })

  @IsOptional()

  scheduledDate: any;

  @ApiProperty({
    description: 'The guest ID attached to this model',
    example: '002',
    readOnly: true,
  })

  @IsOptional()

  guestId: any;

  @ApiProperty({
    description: 'The type of user; either Guest or User',
    example: 'Guest',
    readOnly: true,
  })

  @IsOptional()

  userType: any;

  @ApiProperty({
    description: 'The status of the appointment',
    example: 'In Progess',
    readOnly: true,
  })

  @IsOptional()

  status: any;

  @ApiProperty({
    description: 'Attached comments',
    example: ['Comment 1', 'Comment 2'],
    readOnly: true,
  })

  @IsOptional()

  comments: any;
}
