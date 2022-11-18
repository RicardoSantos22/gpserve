import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsDate,
  IsIn,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';

import { requestStatus, userType } from '../../../entities/shared/enums';
import { carType } from '../../../entities/shared/enums';

export class CreateInsuranceRequestDTO {
  @ApiProperty({
    description: 'The user ID attached to this model',
    example: '001',
  })

  @IsString()
  @IsNotEmpty()

  readonly userId: string;

  asesorid : string;

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

  @IsString()

  readonly preferredBroker: string;

  @ApiProperty({
    description: 'The type of car; either New or Used',
    example: 'New',
  })

  @IsEnum(carType)

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
    example: userType.user,
  })

  @IsEnum(userType)

  readonly userType: userType;

  @ApiProperty({
    description: 'The status of the insurance',
    example: 'Sin procesar',
  })

  @IsEnum(requestStatus)
  readonly status: requestStatus;
};
