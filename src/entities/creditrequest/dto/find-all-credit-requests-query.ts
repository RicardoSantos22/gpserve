import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { CreateCreditRequestDTO } from './create-credit-request';

import { FindAllQuery } from '../../../common/models/dto/query/find-all-query.dto';

export class FindAllCreditRequestsQuery extends PartialType(FindAllQuery) implements Partial<CreateCreditRequestDTO> {
  id: any;

  @ApiProperty({
    description: 'The social URLs of the Agencies',
    example: [{ id: '1', urls: ['agency1.com', 'agency2.com'] }, { id: '2', urls: ['agency3.com', 'agency4.com'] }],
    readOnly: true,
  })

  @IsOptional()

  webUrls: any;

  @ApiProperty({
    description: 'The car ID attached to this model',
    example: '001',
    readOnly: true,
  })

  @IsOptional()

  carId: any;

  @ApiProperty({
    description: 'The current down payment of the vehicle',
    example: 100000,
    readOnly: true,
  })

  @IsOptional()

  downPayment: any;

  @ApiProperty({
    description: 'THe time in months that the credit needs to be payed',
    example: 10,
    readOnly: true,
  })

  @IsOptional()

  creditMonths: any;

  @ApiProperty({
    description: 'The Guest ID attached to this model',
    example: '002',
    readOnly: true,
  })

  @IsOptional()

  guestId: any;

  @ApiProperty({
    description: 'The type of car; either New or Used',
    example: 'Used',
    readOnly: true,
  })

  @IsOptional()

  carType: any;

  @ApiProperty({
    description: 'The type of user; either Guest or User',
    example: 'User',
    readOnly: true,
  })

  @IsOptional()

  userType: any;

  @ApiProperty({
    description: 'Is the user trading a car?',
    example: true,
    readOnly: true,
  })

  @IsOptional()

  hasTradedCar?: any;

  @ApiProperty({
    description: 'The value of the traded car if any',
    example: 50000,
    readOnly: true,
  })

  @IsOptional()

  tradedCarValue?: any;
};
