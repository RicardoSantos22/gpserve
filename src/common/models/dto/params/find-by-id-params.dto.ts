import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class FindByIdParams {
  @ApiProperty({
    description: 'The document unique database identifier',
    example: '5d67489e38dcbd327c03b43a',
  })
  @IsString()
  id: string;
}
