import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';

export class CreateAdminDTO {
  @ApiProperty({
    description: 'Name of the admin',
    example: 'John Doe',
  })

  @IsString()
  @IsNotEmpty()

  readonly name: string;

  @ApiProperty({
    description: 'Email of the admin',
    example: 'john@doe.com',
  })

  @IsString()
  @IsNotEmpty()

  readonly email: string;

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
