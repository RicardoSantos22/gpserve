import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateNoteDTO } from './create-note';
import { FindAllQuery } from '../../../common/models/dto/query/find-all-query.dto';

export class FindAllNotesQuery extends PartialType(FindAllQuery) implements Partial<CreateNoteDTO> {

  id: any;

  @ApiProperty({
    description: "The request's identifier",
    example: "6310d24dbbbe325f5bcc5b49",
  })

  @IsOptional()
  readonly requestId: string;
};
