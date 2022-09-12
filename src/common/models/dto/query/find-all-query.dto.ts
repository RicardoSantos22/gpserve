import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumberString } from 'class-validator';

export class FindAllQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  skip?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  sort?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  fields?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  populate?: string;

  @ApiProperty({ required: false, type: Object })
  @IsOptional()
  filter?: any;

  [x: string]: string | string[];
}
