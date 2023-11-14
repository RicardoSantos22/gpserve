import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';

import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse
} from '@nestjs/swagger';

import { DatabaseErrorDto, NotFoundErrorDto } from '../../../common/models/dto/errors';
import { FindByIdParams, DeleteParams } from '../../../common/models/dto/params';

import { NoteService } from '../service/note.service';

import { Note } from '../model/note.model';
import { CreateNoteDTO } from '../dto/create-note';
import { FindAllNotesQuery } from '../dto/find-all-notes-query';
import { UpdateNoteDTO } from '../dto/update-note';

@ApiTags('note')
@Controller('note')
export class NoteController {
  constructor(private readonly service: NoteService) { }

  /**
   * #region findAll
   * 
   * @param {FindAllQuery} query 
   * @returns
   * @memberof NoteController
   */

  @ApiOperation({
    summary: 'Find all notes',
    description: 'Retrieves all the current values of Notes that match the selected params',
  })

  @ApiOkResponse({
    description: 'Notes have been retrieved successfully',
    type: [Note],
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error in the database while trying to retrieve all Notes',
    type: DatabaseErrorDto,
  })

  // #endregion findAll

  @Get()
  async findAll(@Query() query: FindAllNotesQuery) {
    return this.service.findAll(query);
  };

  /**
   * #region findById
   * 
   * @param {FindByIdParams} params
   * @returns
   * @memberof NoteController
   */

  @ApiOperation({
    summary: 'Find Note by ID',
    description: 'Retrieves an specific Note based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Note with the ID {id} has been found',
    type: Note,
  })

  @ApiNotFoundResponse({
    description: 'The Note with the ID {id} was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was a database error while trying to fetch the specified Note',
    type: DatabaseErrorDto,
  })

  // #endregion findById

  @Get(':id')
  async findById(@Param() params: FindByIdParams) {
    return this.service.findById(params.id);
  }

  /**
   * #region create
   * 
   * @param {CreateNoteDTO} body
   * @returns
   * @memberof NoteController
  */

  @ApiOperation({
    summary: 'Create Note',
    description: 'Creates a new Note',
  })

  @ApiOkResponse({
    description: 'The Note has been created correctly in the database',
    type: Note,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error in the database, the Note was not created',
    type: DatabaseErrorDto,
  })

  // #endregion create
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, forbidUnknownValues: true }))
  @Post()
  async create(@Body() body: CreateNoteDTO) {
    return this.service.create({ ...body });
  }

  /**
   * #region update
   * 
   * @param {FindByIdParams} params
   * @param {UpdateNoteDTO} body
   * @returns
   * @memberof UseerController
   */

  @ApiOperation({
    summary: 'Update Note',
    description: 'Updates a specific Note based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Note was updated successfully',
    type: Note,
  })

  @ApiNotFoundResponse({
    description: 'The specific Note was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error while trying to update the Note',
    type: DatabaseErrorDto,
  })

  // #endregion update

  @Patch(':id')
  async update(@Param() params: FindByIdParams, @Body() body: UpdateNoteDTO) {
    return this.service.update(params.id, body);
  }

  /**
   * #region delete
   * 
   * @param {DeleteParams} params
   * @returns
   * @memberof NoteController
   */

  @ApiOperation({
    summary: 'Delete Note',
    description: 'Deletes a specific Note based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Note with the given ID {id} was deleted successfully',
    type: Boolean,
  })

  @ApiNotFoundResponse({
    description: 'The specific Note was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error while trying to delete the Note',
    type: DatabaseErrorDto,
  })

  // #endregion delete

  @Delete(':id')
  async delete(@Param() params: DeleteParams) {
    return { id: await this.service.delete(params.id) };
  }
}
