import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class DeleteParams {
  @ApiProperty({
    description: 'The document unique database identifier',
    example: '5d67489e38dcbd327c03b43a',
  })
  @IsMongoId()
  id: string;
}
