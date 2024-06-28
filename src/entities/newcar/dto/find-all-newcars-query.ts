import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { CreateNewCarDTO } from './create-newcar';

import { FindAllQuery } from '../../../common/models/dto/query/find-all-query.dto';
import { Expose } from 'class-transformer';

export class FindAllNewCarsQuery extends PartialType(FindAllQuery) implements Partial<CreateNewCarDTO> {
  _id: any;

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

  @ApiProperty({
    description: "The car's series",
    example: 'Some car series',
    readOnly: true,
  })

  @IsOptional()

  series: any;

  @ApiProperty({
    description: "The car's price",
    example: '900000',
    readOnly: true,
  })

  @IsOptional()

  price: any;

  @ApiProperty({
    description: "The car's manufacturing year",
    example: '2005',
    readOnly: true,
  })

  @IsOptional()

  year: any;

  @ApiProperty({
    description: "The car's transmission type",
    example: 'Automatic',
    readOnly: true,
  })

  @IsOptional()

  transmision: any;

  @ApiProperty({
    description: "The car's fuel type",
    example: 'Some car fuel type',
    readOnly: true,
  })

  @IsOptional()

  fuel: any;

  @ApiProperty({
    description: "The car's colour",
    example: 'Red',
    readOnly: true,
  })

  @IsOptional()
  status: string;

  @IsOptional()

  @Expose({name: 'colours'})

  baseColour: any;
};
