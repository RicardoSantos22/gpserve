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

import { NewCar } from '../model/newcar.model';
import { NewCarService } from '../service/newcar.service';

import { CreateNewCarDTO } from '../dto/create-newcar';
import { FindAllNewCarsQuery } from '../dto/find-all-newcars-query';
import { UpdateNewCarDTO } from '../dto/update-newcar';

@Controller('newcar')
export class NewCarController {
  constructor(private readonly service: NewCarService) {}

  /**
   * #region findAll
   * 
   * @param {FindAllQuery} query 
   * @returns
   * @memberof NewCarController
   */

   @ApiOperation({
    summary: 'Find all New Cars',
    description: 'Retrieves all the current values of New Cars that match the selected params',
  })

  @ApiOkResponse({
    description: 'New Cars have been retrieved successfully',
    type: [NewCar],
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error in the database while trying to retrieve all New Cars',
    type: DatabaseErrorDto,
  })

  // #endregion findAll

  @Get()
  async findAll(@Query() query: FindAllNewCarsQuery) {
    return this.service.findAll(query);
  };

  /**
   * #region findById
   * 
   * @param {FindByIdParams} params
   * @returns
   * @memberof NewCarController
   */

  @ApiOperation({
    summary: 'Find New Car by ID',
    description: 'Retrieves an specific New Car based on the given ID',
  })

  @ApiOkResponse({
    description: 'The New Car with the ID {id} has been found',
    type: NewCar,
  })

  @ApiNotFoundResponse({
    description: 'The New Car with the ID {id} was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was a database error while trying to fetch the specified New Car',
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
   * @param {CreateNewCarDTO} body
   * @returns
   * @memberof NewCarController
  */

  @ApiOperation({
    summary: 'Create New Car',
    description: 'Creates a new New Car',
  })

  @ApiOkResponse({
    description: 'The New Car has been created correctly in the database',
    type: NewCar,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error in the database, the New Car was not created',
    type: DatabaseErrorDto,
  })

  // #endregion create

  @Post()
  async create(@Body() body: CreateNewCarDTO) {
    return this.service.create({ ...body });
  }

  @Post('setup')
  async getCarCatalogue() {
    return this.service.getCarCatalogue()
  }

  /**
   * #region update
   * 
   * @param {FindByIdParams} params
   * @param {UpdateNewCarDTO} body
   * @returns
   * @memberof UseerController
   */

  @ApiOperation({
    summary: 'Update New Car',
    description: 'Updates a specific New Car based on the given ID',
  })

  @ApiOkResponse({
    description: 'The New Car was updated successfully',
    type: NewCar,
  })

  @ApiNotFoundResponse({
    description: 'The specific New Car was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error while trying to update the New Car',
    type: DatabaseErrorDto,
  })

  // #endregion update

  @Patch(':id')
  async update(@Param() params: FindByIdParams, @Body() body: UpdateNewCarDTO) {
    return this.service.update(params.id, body);
  }

  /**
   * #region delete
   * 
   * @param {DeleteParams} params
   * @returns
   * @memberof NewCarController
   */

  @ApiOperation({
    summary: 'Delete New Car',
    description: 'Deletes a specific New Car based on the given ID',
  })

  @ApiOkResponse({
    description: 'The New Car with the given ID {id} was deleted successfully',
    type: Boolean,
  })

  @ApiNotFoundResponse({
    description: 'The specific New Car was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error while trying to delete the New Car',
    type: DatabaseErrorDto,
  })

  // #endregion delete

  @Delete(':id')
  async delete(@Param() params: DeleteParams) {
    return { id: await this.service.delete(params.id) };
  };
}
