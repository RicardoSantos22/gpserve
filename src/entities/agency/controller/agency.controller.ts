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

import { Agency } from '../model/agency.model';
import { AgencyService } from '../service/agency.service';

import { CreateAgencyDTO } from '../dto/create-agency';
import { FindAllAgenciesQuery } from '../dto/find-all-agencies-query';
import { UpdateAgencyDTO } from '../dto/update-agency';

@Controller('agency')
export class AgencyController {
  constructor(private readonly service: AgencyService) {}

  /**
   * #region findAll
   * 
   * @param {FindAllQuery} query 
   * @returns
   * @memberof AgencyController
   */

   @ApiOperation({
    summary: 'Find all Agencies',
    description: 'Retrieves all the current values of Agencies that match the selected params',
  })

  @ApiOkResponse({
    description: 'Agencies have been retrieved successfully',
    type: [Agency],
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error in the database while trying to retrieve all Agencies',
    type: DatabaseErrorDto,
  })

  // #endregion findAll

  @Get()
  async findAll(@Query() query: FindAllAgenciesQuery) {
    return this.service.findAll(query);
  };

  /**
   * #region findById
   * 
   * @param {FindByIdParams} params
   * @returns
   * @memberof AgencyController
   */

  @ApiOperation({
    summary: 'Find Agency by ID',
    description: 'Retrieves an specific Agency based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Agency with the ID {id} has been found',
    type: Agency,
  })

  @ApiNotFoundResponse({
    description: 'The Agency with the ID {id} was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was a database error while trying to fetch the specified Agency',
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
   * @param {CreateAgencyDTO} body
   * @returns
   * @memberof AgencyController
  */

  @ApiOperation({
    summary: 'Create Agency',
    description: 'Creates a new Agency',
  })

  @ApiOkResponse({
    description: 'The Agency has been created correctly in the database',
    type: Agency,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error in the database, the Agency was not created',
    type: DatabaseErrorDto,
  })

  // #endregion create

  @Post()
  async create(@Body() body: CreateAgencyDTO) {
    return this.service.create({ ...body });
  }

  /**
   * #region update
   * 
   * @param {FindByIdParams} params
   * @param {UpdateAgencyDTO} body
   * @returns
   * @memberof UseerController
   */

  @ApiOperation({
    summary: 'Update Agency',
    description: 'Updates a specific Agency based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Agency was updated successfully',
    type: Agency,
  })

  @ApiNotFoundResponse({
    description: 'The specific Agency was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error while trying to update the Agency',
    type: DatabaseErrorDto,
  })

  // #endregion update

  @Patch(':id')
  async update(@Param() params: FindByIdParams, @Body() body: UpdateAgencyDTO) {
    return this.service.update(params.id, body);
  }

  /**
   * #region delete
   * 
   * @param {DeleteParams} params
   * @returns
   * @memberof AgencyController
   */

  @ApiOperation({
    summary: 'Delete Agency',
    description: 'Deletes a specific Agency based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Agency with the given ID {id} was deleted successfully',
    type: Boolean,
  })

  @ApiNotFoundResponse({
    description: 'The specific Agency was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error while trying to delete the Agency',
    type: DatabaseErrorDto,
  })

  // #endregion delete

  @Delete(':id')
  async delete(@Param() params: DeleteParams) {
    return { id: await this.service.delete(params.id) };
  }
}
