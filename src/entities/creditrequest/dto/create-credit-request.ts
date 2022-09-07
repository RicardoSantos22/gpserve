import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsNumber,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsIn,
  IsEnum,
} from 'class-validator';

import { carType } from '../../../entities/shared/enums';
import { userType } from '../../../entities/shared/enums';

export class CreateCreditRequestDTO {

  @ApiProperty({
    description: 'The car ID attached to this model',
    example: '001',
  })

  @IsString()
  @IsNotEmpty()

  readonly carId: string;

  @ApiProperty({
    description: 'The asesor ID attached to this model',
    example: '001',
  })

  @IsString()
  asesorid: string;

  @IsString()
  @IsNotEmpty()

  readonly agencyId: string;

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

  readonly userId: string;

  @ApiProperty({
    description: 'The type of car; either New or Used',
    example: 'Used',
  })

  @IsEnum(carType)

  readonly carType: carType;

  @ApiProperty({
    description: 'The type of user; either Guest or User',
    example: 'User',
  })

  @IsEnum(userType)

  readonly userType: userType;

  @ApiProperty({
    description: 'Is the user trading a car?',
    example: true,
  })

  @IsBoolean()

  readonly hasTradedCar: boolean;

  @ApiProperty({
    description: 'The value of the traded car if any',
    example: 50000,
  })

  @IsNumber()
  @IsOptional()

  readonly tradedCarValue?: number;
};
