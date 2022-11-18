import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateGuestDTO {
  @ApiProperty({
    description: 'Name of the guest',
    example: 'John Doe',
  })

  @IsString()
  @IsNotEmpty()

  readonly name: string;

  @ApiProperty({
    description: 'Email of the guest',
    example: 'john@doe.com',
  })

  @IsString()
  @IsNotEmpty()

  readonly email: string;

  @ApiProperty({
    description: "The guest's phone; can be optional",
    example: '961 281 7653',
  })

  @IsString()
  @IsOptional()

  readonly phone?: string;
};
