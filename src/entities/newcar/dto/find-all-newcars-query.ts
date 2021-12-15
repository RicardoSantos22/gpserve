import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { CreateNewCarDTO } from './create-newcar';

import { FindAllQuery } from '../../../common/models/dto/query/find-all-query.dto';

export class FindAllNewCarsQuery extends PartialType(FindAllQuery) implements Partial<CreateNewCarDTO> {
  id: any;

  @ApiProperty({
    description: 'The agency ID attached to this model',
    example: '002',
    readOnly: true,
  })

  @IsOptional()

  agencyId: any;

  @ApiProperty({
    description: "The car's brand",
    example: 'Mercedes',
    readOnly: true,
  })

  @IsOptional()

  brand: any;

  @ApiProperty({
    description: "The car's model",
    example: 'Some car model',
    readOnly: true,
  })

  @IsOptional()

  model: any;
};
