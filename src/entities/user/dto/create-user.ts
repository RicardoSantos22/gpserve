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

  readonly name: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'john@doe.com',
  })

  @IsString()
  @IsNotEmpty()

  readonly email: string;

  @ApiProperty({
    description: "The user's phone; can be optional",
    example: '961 281 7653',
  })

  @IsString()
  @IsOptional()

  readonly phone?: string;

  @ApiProperty({
    description: "The user's state",
    example: 'CDMX',
  })

  @IsString()
  @IsNotEmpty()

  readonly state: string;

  @ApiProperty({
    description: "The user's ZIP code",
    example: 64700,
  })

  @IsNumber()
  @IsNotEmpty()

  readonly zipCode: number;

  @ApiProperty({
    description: "The user's RFC; can be optional",
    example: 'MERS770202X2P',
  })

  @IsString()
  @IsOptional()

  readonly rfc?: string;

  @ApiProperty({
    description: "The user's wishlist of new cars",
    example: ['Range Rover', 'Corola'],
  })

  @IsArray()

  readonly newCarsWishlist: string[];

  @ApiProperty({
    description: "The user's wishlist of used cars",
    example: ['Range Rover', 'Corola'],
  })

  @IsArray()

  readonly usedCarsWishlist: string[];

  @ApiProperty({
    description: 'Is the user verified?',
    example: false,
  })

  @IsBoolean()

  readonly isVerified: boolean;

  @ApiProperty({
    description: 'Is the user disabled?',
    example: true,
  })

  @IsBoolean()

  readonly isDisabled: boolean;
};
