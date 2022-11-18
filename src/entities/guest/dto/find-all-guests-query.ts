import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { CreateGuestDTO } from './create-guest';

import { FindAllQuery } from '../../../common/models/dto/query/find-all-query.dto';

export class FindAllGuestsQuery extends PartialType(FindAllQuery) implements Partial<CreateGuestDTO> {
  id: any;

  @ApiProperty({
    description: 'Name of the guest',
    example: 'John Doe',
    readOnly: true,
  })

  @IsOptional()

  name: any;

  @ApiProperty({
    description: 'Email of the guest',
    example: 'john@doe.com',
    readOnly: true,
  })

  @IsOptional()

  email: any;

  @ApiProperty({
    description: "The guest's phone; can be optional",
    example: '961 281 7653',
    readOnly: true,
  })

  @IsOptional()

  phone?: any;
};
