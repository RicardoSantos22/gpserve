import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsNumber,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })

  @IsString()
  @IsNotEmpty()

  readonly firstName: string;

  @ApiProperty({
    description: 'Last Name of the user',
    example: 'John Doe',
  })

  @IsString()
  @IsNotEmpty()

  readonly lastName: string;

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })

  @IsString()
  @IsNotEmpty()

  readonly secondLastName: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'john@doe.com',
  })

  @IsString()
  @IsNotEmpty()

  readonly email: string;

  @ApiProperty({
    description: 'Firebase ID Auth of the user',
    example: 'firebase-id-21876291',
  })

  @IsString()
  @IsNotEmpty()

  readonly firebaseId: string;

  @ApiProperty({
    description: "The user's phone; can be optional",
    example: '961 281 7653',
  })

  @IsString()
  @IsNotEmpty()

  readonly phone: string;

  @ApiProperty({
    description: "The user's state",
    example: 'CDMX',
  })

  @IsString()
  @IsOptional()

  readonly state: string;

  @ApiProperty({
    description: "The user's ZIP code",
    example: 64700,
  })

  @IsNumber()
  @IsOptional()

  readonly zipCode: number;

  @ApiProperty({
    description: "The user's RFC; can be optional",
    example: 'MERS770202X2P',
  })

  @IsString()
  @IsOptional()

  readonly rfc?: string;

};
