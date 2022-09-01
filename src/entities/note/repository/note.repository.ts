import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { CrudRepository } from '../../../common/crud/crud.repository';
import { Note } from '../model/note.model';

@Injectable()
export class NoteRepository extends CrudRepository<Note> {
  constructor(@InjectModel(Note) readonly model: ReturnModelType<typeof Note>) {
    super(model, 'Note');
  }
};
