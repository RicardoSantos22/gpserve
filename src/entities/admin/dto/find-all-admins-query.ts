import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { CreateAdminDTO } from './create-admin';

import { FindAllQuery } from '../../../common/models/dto/query/find-all-query.dto';

export class FindAllAdminsQuery extends PartialType(FindAllQuery) implements Partial<CreateAdminDTO> {
  id: any;

  @ApiProperty({
    description: 'Name of the admin',
    example: 'John Doe',
    readOnly: true,
  })

  @IsOptional()

  name: any;

  @ApiProperty({
    description: 'Email of the admin',
    example: 'john@doe.com',
    readOnly: true,
  })

  @IsOptional()

  email: any;

  @ApiProperty({
    description: "The model's indetifier in Firebase",
    readOnly: true,
  })

  @IsOptional()

  firebaseId: any;

  @ApiProperty({
    description: 'The agency ID attached to this model',
    example: 'Some agency',
    readOnly: true,
  })

  @IsOptional()

  agencyId: any;

  @ApiProperty({
    description: 'Is the admin a super admin?',
    example: true,
    readOnly: true,
  })

  @IsOptional()

  isSuperAdmin: any;

  @ApiProperty({
    description: 'Is the admin disabled?',
    example: true,
    readOnly: true,
  })

  @IsOptional()

  isDisabled: any;

  @ApiProperty({
    description: 'A list of permission for the current admin',
    example: ['Permission 1', 'Permission 2'],
    readOnly: true,
  })

  @IsOptional()

  permissions: any;
};
