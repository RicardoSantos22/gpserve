import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { CreateAgencyDTO } from './create-agency';

import { FindAllQuery } from '../../../common/models/dto/query/find-all-query.dto';

export class FindAllAgenciesQuery extends PartialType(FindAllQuery) implements Partial<CreateAgencyDTO> {
  id: any;

  @ApiProperty({
    description: 'The state of the Agency',
    example: 'CDMX',
    readOnly: true,
  })

  @IsOptional()

  state: any;

  @ApiProperty({
    description: 'The location of the agency',
    example: 'Some location',
    readOnly: true,
  })

  @IsOptional()

  location: any;

  @ApiProperty({
    description: "The map's reference for the Agency",
    example: 'Some image blob',
    readOnly: true,
  })

  @IsOptional()

  mapImage: any;

  @ApiProperty({
    description: 'The list of permissions for the Administrators',
    example: ['Permission 1', 'Permission 2'],
    readOnly: true,
  })

  @IsOptional()

  permissions: any;

  @ApiProperty({
    description: 'The number of the Agency',
    example: 1,
    readOnly: true,
  })

  @IsOptional()

  number: any;

  @ApiProperty({
    description: 'The email of the Agency',
    example: 'email@agency.com',
    readOnly: true,
  })

  @IsOptional()

  email: any;

  @ApiProperty({
    description: 'The availability of the Agency for inspections',
    example: { start: '10:00', end: '18:00' },
    readOnly: true,
  })

  @IsOptional()

  inspectionHours: any;

  @ApiProperty({
    description: 'The available brands in the Agency',
    example: ['Range Rover', 'Corola'],
    readOnly: true,
  })

  @IsOptional()

  brands: any;

  @ApiProperty({
    description: 'The name of the Agency',
    example: 'Some agency name',
    readOnly: true,
  })

  @IsOptional()

  name: any;

  @ApiProperty({
    description: 'Social URLs associated with the Agency',
    example: { id: '1', urls: ['agency1.com', 'agency2.com'] },
    readOnly: true,
  })

  @IsOptional()

  webUrls: any;
};
