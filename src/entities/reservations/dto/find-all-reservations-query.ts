import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { CreateReservationDTO } from './create-reservation';

import { FindAllQuery } from '../../../common/models/dto/query/find-all-query.dto';

export class FindAllReservationsQuery extends PartialType(FindAllQuery) implements Partial<CreateReservationDTO> {
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
    example: '004',
    readOnly: true,
  })

  @IsOptional()

  carId: any;

  @ApiProperty({
    description: 'The type of car; either New or Used',
    example: 'New',
    readOnly: true,
  })

  @IsOptional()

  carType: any;

  @ApiProperty({
    description: "The payment's reference",
    example: '003340',
    readOnly: true,
  })

  @IsOptional()

  paymentReference: any;

  @ApiProperty({
    description: 'The current status of the payment',
    example: 'Pending Payment',
    readOnly: true,
  })

  @IsOptional()

  status: any;

  @ApiProperty({
    description: 'The response of the payment',
    readOnly: true,
  })

  paymentResponse: any;
};