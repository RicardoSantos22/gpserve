import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsNotEmpty, IsIn } from 'class-validator';

import { carType } from '../../../entities/shared/enums';

export class CreateReservationDTO {
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
    example: '004',
  })

  @IsString()
  @IsNotEmpty()

  readonly carId: string;

  @ApiProperty({
    description: 'The type of car; either New or Used',
    example: 'New',
  })

  @IsIn(Object.values(carType))

  readonly carType: carType;

  @ApiProperty({
    description: "The payment's reference",
    example: '003340',
  })

  @IsString()
  @IsNotEmpty()

  readonly paymentReference: string;

  @ApiProperty({
    description: 'The current status of the payment',
    example: 'Pending Payment',
  })

  @IsString()
  @IsNotEmpty()

  readonly status: string;

  @ApiProperty({ description: 'The response of the payment' })

  readonly paymentResponse: any;
};
