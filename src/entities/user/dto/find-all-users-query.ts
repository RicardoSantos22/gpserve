import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { CreateUserDTO } from './create-user';

import { FindAllQuery } from '../../../common/models/dto/query/find-all-query.dto';

export class FindAllUsersQuery extends PartialType(FindAllQuery) implements Partial<CreateUserDTO> {
  id: any;

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
    readOnly: true,
  })

  @IsOptional()

  name: any;

  @ApiProperty({
    description: 'Email of the user',
    example: 'john@doe.com',
    readOnly: true,
  })

  @IsOptional()

  email: any;

  @ApiProperty({
    description: "The user's phone; can be optional",
    example: '961 281 7653',
    readOnly: true,
  })

  @IsOptional()

  phone?: any;

  @ApiProperty({
    description: "The model's indetifier in Firebase",
    readOnly: true,
  })

  @IsOptional()

  firebaseId: any;

  @ApiProperty({
    description: "The user's state",
    example: 'CDMX',
    readOnly: true,
  })

  @IsOptional()

  state: any;

  @ApiProperty({
    description: "The user's ZIP code",
    example: 64700,
    readOnly: true,
  })

  @IsOptional()

  zipCode: any;

  @ApiProperty({
    description: "The user's RFC; can be optional",
    example: 'MERS770202X2P',
    readOnly: true,
  })

  @IsOptional()

  rfc?: any;

  @ApiProperty({
    description: "The user's wishlist of new cars",
    example: ['Range Rover', 'Corola'],
    readOnly: true,
  })

  @IsOptional()

  newCarsWishlist: any;

  @ApiProperty({
    description: "The user's wishlist of used cars",
    example: ['Range Rover', 'Corola'],
    readOnly: true,
  })

  @IsOptional()

  usedCarsWishlist: any;

  @ApiProperty({
    description: 'Is the user verified?',
    example: false,
    readOnly: true,
  })

  @IsOptional()

  isVerified: any;

  @ApiProperty({
    description: 'Is the user disabled?',
    example: true,
    readOnly: true,
  })

  @IsOptional()

  isDisabled: any;
};
