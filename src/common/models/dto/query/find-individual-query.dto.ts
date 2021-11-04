import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FindIndividualQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  selectFields?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  populateFields?: string;
}
