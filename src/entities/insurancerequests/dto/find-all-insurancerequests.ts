import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { CreateInsuranceRequestDTO } from './create-insurancerequest';

import { FindAllQuery } from '../../../common/models/dto/query/find-all-query.dto';

export class FindAllInsuranceRequestsQuery extends PartialType(FindAllQuery) implements Partial<CreateInsuranceRequestDTO> {
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
    description: 'The preferred broker for the request',
    readOnly: true,
  })

  @IsOptional()

  preferredBroker: any;

  @ApiProperty({
    description: 'The type of car; either New or Used',
    example: 'New',
    readOnly: true,
  })

  @IsOptional()

  carType: any;

  @ApiProperty({
    description: 'The guest ID attached to this model',
    example: '005',
    readOnly: true,
  })

  @IsOptional()

  guestId: any;

  @ApiProperty({
    description: 'The type of user; either Guest or User',
    example: 'USer',
    readOnly: true,
  })

  @IsOptional()

  userType: any;
};
