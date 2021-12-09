import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsNumber,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsIn,
} from 'class-validator';

import { carType } from '../../../entities/shared/enums';
import { userType } from '../../../entities/shared/enums';

export class CreateCreditRequestDTO {
  @ApiProperty({
    description: 'The social URLs of the Agencies',
    example: [{ id: '1', urls: ['agency1.com', 'agency2.com'] }, { id: '2', urls: ['agency3.com', 'agency4.com'] }],
  })

  @IsArray()

  readonly webUrls: {
    id: string,
    url: string
  }[];

  @ApiProperty({
    description: 'The car ID attached to this model',
    example: '001',
  })

  @IsString()
  @IsNotEmpty()

  readonly carId: string;

  @ApiProperty({
    description: 'The current down payment of the vehicle',
    example: 100000,
  })

  @IsNumber()
  @IsNotEmpty()

  readonly downPayment: number;

  @ApiProperty({
    description: 'THe time in months that the credit needs to be payed',
    example: 10,
  })

  @IsNumber()
  @IsNotEmpty()

  readonly creditMonths: number;

  @ApiProperty({
    description: 'The Guest ID attached to this model',
    example: '002',
  })

  @IsString()

  readonly string: string;

  @ApiProperty({
    description: 'The type of car; either New or Used',
    example: 'Used',
  })

  @IsIn(Object.values(carType))

  readonly carType: carType;

  @ApiProperty({
    description: 'The type of user; either Guest or User',
    example: 'User',
  })

  @IsIn(Object.values(userType))

  readonly userType: userType;

  @ApiProperty({
    description: 'Is the user trading a car?',
    example: true,
  })

  @IsBoolean()
  @IsOptional()

  readonly hasTradedCar?: boolean;

  @ApiProperty({
    description: 'The value of the traded car if any',
    example: 50000,
  })

  @IsNumber()
  @IsOptional()

  readonly tradedCarValue?: number;
};
