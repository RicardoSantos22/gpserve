import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { Note } from './model/note.model';
import { NoteController } from './controller/note.controller';
import { NoteService } from './service/note.service';
import { NoteRepository } from './repository/note.repository';

@Module({
  imports: [TypegooseModule.forFeature([Note])],
  controllers: [NoteController],
  providers: [NoteService, NoteRepository],
})

export class NoteModule {}
