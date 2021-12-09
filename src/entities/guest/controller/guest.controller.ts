import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';

import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnprocessableEntityResponse
} from '@nestjs/swagger';

import { DatabaseErrorDto, NotFoundErrorDto } from '../../../common/models/dto/errors';
import { FindByIdParams, DeleteParams } from '../../../common/models/dto/params';

import { Guest } from '../model/guest.model';
import { GuestService } from '../service/guest.service';

import { CreateGuestDTO } from '../dto/create-guest';
import { FindAllGuestsQuery } from '../dto/find-all-guests-query';
import { UpdateGuestDTO } from '../dto/update-guest';

@Controller('guest')
export class GuestController {
  constructor(private readonly service: GuestService) {}

  /**
   * #region findAll
   * 
   * @param {FindAllQuery} query 
   * @returns
   * @memberof GuestController
   */

   @ApiOperation({
    summary: 'Find all Guests',
    description: 'Retrieves all the current values of Guests that match the selected params',
  })

  @ApiOkResponse({
    description: 'Guests have been retrieved successfully',
    type: [Guest],
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error in the database while trying to retrieve all Guests',
    type: DatabaseErrorDto,
  })

  // #endregion findAll

  @Get()
  async findAll(@Query() query: FindAllGuestsQuery) {
    return this.service.findAll(query);
  };

  /**
   * #region findById
   * 
   * @param {FindByIdParams} params
   * @returns
   * @memberof GuestController
   */

  @ApiOperation({
    summary: 'Find Guest by ID',
    description: 'Retrieves an specific Guest based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Guest with the ID {id} has been found',
    type: Guest,
  })

  @ApiNotFoundResponse({
    description: 'The Guest with the ID {id} was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was a database error while trying to fetch the specified Guest',
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
   * @param {CreateGuestDTO} body
   * @returns
   * @memberof GuestController
  */

  @ApiOperation({
    summary: 'Create Guest',
    description: 'Creates a new Guest',
  })

  @ApiOkResponse({
    description: 'The Guest has been created correctly in the database',
    type: Guest,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error in the database, the Guest was not created',
    type: DatabaseErrorDto,
  })

  // #endregion create

  @Post()
  async create(@Body() body: CreateGuestDTO) {
    return this.service.create({ ...body });
  }

  /**
   * #region update
   * 
   * @param {FindByIdParams} params
   * @param {UpdateGuestDTO} body
   * @returns
   * @memberof UseerController
   */

  @ApiOperation({
    summary: 'Update Guest',
    description: 'Updates a specific Guest based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Guest was updated successfully',
    type: Guest,
  })

  @ApiNotFoundResponse({
    description: 'The specific Guest was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error while trying to update the Guest',
    type: DatabaseErrorDto,
  })

  // #endregion update

  @Patch(':id')
  async update(@Param() params: FindByIdParams, @Body() body: UpdateGuestDTO) {
    return this.service.update(params.id, body);
  }

  /**
   * #region delete
   * 
   * @param {DeleteParams} params
   * @returns
   * @memberof GuestController
   */

  @ApiOperation({
    summary: 'Delete Guest',
    description: 'Deletes a specific Guest based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Guest with the given ID {id} was deleted successfully',
    type: Boolean,
  })

  @ApiNotFoundResponse({
    description: 'The specific Guest was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error while trying to delete the Guest',
    type: DatabaseErrorDto,
  })

  // #endregion delete

  @Delete(':id')
  async delete(@Param() params: DeleteParams) {
    return { id: await this.service.delete(params.id) };
  }
}
