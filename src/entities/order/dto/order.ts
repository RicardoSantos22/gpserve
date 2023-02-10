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

import { carType, requestStatus } from '../../../entities/shared/enums';
import { userType } from '../../../entities/shared/enums';

export class CreateCreditRequestDTO {

  @ApiProperty({
    description: 'The car vim attached to this model',
    example: '001',
  })

  @IsString()
  @IsNotEmpty()

  readonly carvin: string;

  @ApiProperty({
    description: 'The Guest ID attached to this model',
    example: '002',
  })

  @IsString()

  readonly userId: string;

 
  readonly tradedCarValue?: number;

  @ApiProperty({
    description: 'The status of the credit',
    example: 'Sin procesar',
  })

  @IsEnum(requestStatus)

  readonly status: requestStatus;
};
