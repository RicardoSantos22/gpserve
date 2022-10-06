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

export class HmacDTO {

    @ApiProperty({
        description: 'amount to reserve or buy the car',
        example: '15000',
      })
    
      @IsString()
      @IsNotEmpty()
    
      readonly amount: string;
}