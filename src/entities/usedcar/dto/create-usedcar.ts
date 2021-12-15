import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUsedCarDTO {
  @ApiProperty({
    description: 'The agency ID attached to this model',
    example: '002',
  })

  @IsString()
  @IsNotEmpty()

  readonly agencyId: string;

  @ApiProperty({
    description: "The car's brand",
    example: 'Mercedes',
  })

  @IsString()

  readonly brand: string;

  @ApiProperty({
    description: "The car's model",
    example: 'Some car model',
  })

  @IsString()

  readonly model: string;
};
