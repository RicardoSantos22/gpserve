import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class FindByIdQuery {
  @ApiProperty()
  @IsMongoId()
  id: string;
}
