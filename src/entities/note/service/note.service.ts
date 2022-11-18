import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CrudService } from '../../../common/crud/crud.service';

import { Note } from '../model/note.model';
import { NoteRepository } from '../repository/note.repository';

@Injectable()
export class NoteService extends CrudService<Note> {
  constructor(
    readonly repository: NoteRepository,
    readonly config: ConfigService,
  ) {
    super(repository, 'Note', config);
  }
};
