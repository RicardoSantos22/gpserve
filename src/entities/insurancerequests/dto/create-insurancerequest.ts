import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsDate,
  IsIn,
  IsNotEmpty,
} from 'class-validator';

import { userType } from '../../../entities/shared/enums';
import { carType } from '../../../entities/shared/enums';

export class CreateInsuranceRequestDTO {
  @ApiProperty({
    description: 'The user ID attached to this model',
    example: '001',
  })

  @IsString()
  @IsNotEmpty()

  readonly userId: string;

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

  @ApiProperty({ description: 'The preferred broker for the request' })

  @IsDate()

  readonly preferredBroker: Date;

  @ApiProperty({
    description: 'The type of car; either New or Used',
    example: 'New',
  })

  @IsIn(Object.values(carType))

  readonly carType: carType;

  @ApiProperty({
    description: 'The guest ID attached to this model',
    example: '005',
  })

  @IsString()
  @IsNotEmpty()

  readonly guestId: string;

  @ApiProperty({
    description: 'The type of user; either Guest or User',
    example: 'USer',
  })

  @IsIn(Object.values(userType))

  readonly userType: userType;
};
