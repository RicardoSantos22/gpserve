import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsBoolean,
  IsEmail,
} from 'class-validator';

export class CreateAdminDTO {
  @ApiProperty({
    description: `The admin's email`,
    example: 'john.doe@gmail.org',
  })
  @IsEmail()
  readonly firstName!: string;

  @ApiProperty({
    description: `The admin's email`,
    example: 'john.doe@gmail.org',
  })
  @IsEmail()
  readonly lastName!: string;

  @ApiProperty({
    description: `The admin's email`,
    example: 'john.doe@gmail.org',
  })
  @IsEmail()
  readonly name!: string;

  @ApiProperty({
    description: `The admin's email`,
    example: 'john.doe@gmail.org',
  })
  @IsEmail()
  readonly email!: string;

  @ApiProperty({
    description: 'The agency ID attached to this model',
    example: 'SOme agency',
  })

  @IsString()
  @IsNotEmpty()

  readonly agencyId: string;

  @ApiProperty({
    description: 'Is the admin a super admin?',
    example: true,
  })

  @IsBoolean()
  @IsNotEmpty()

  readonly isSuperAdmin: boolean;

  @ApiProperty({
    description: 'Is the admin disabled?',
    example: true,
  })

  @IsBoolean()
  @IsNotEmpty()

  readonly isDisabled: boolean;

  @ApiProperty({
    description: 'A list of permission for the current admin',
    example: ['Permission 1', 'Permission 2'],
  })

  @IsArray()

  readonly permissions: string[];
};
