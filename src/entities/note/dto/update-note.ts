import { PartialType } from '@nestjs/swagger';
import { CreateNoteDTO } from './create-note';

export class UpdateNoteDTO extends PartialType(CreateNoteDTO) {};
