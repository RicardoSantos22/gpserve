import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsDate,
  IsIn,
  IsNotEmpty,
  IsEnum,
  IsNumber,
} from 'class-validator';

import { requestStatus, userType } from '../../../entities/shared/enums';
import { carType } from '../../../entities/shared/enums';

export class HmacDTO {

    @ApiProperty({
        description: 'amount to reserve or buy the car',
        example: '15000',
      })
    
      @IsString()
    
      readonly amount: string;

      @ApiProperty({
        description: 'Concept to reserve or buy the car',
        example: '1 = apartado, 2 = compra',
      })
    
      @IsNumber()
    
      readonly concept: number;
}