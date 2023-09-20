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
  ApiUnprocessableEntityResponse
} from '@nestjs/swagger';

import { asesoresservice } from '../../asesores/service/asesores.service'

import { DatabaseErrorDto, NotFoundErrorDto } from '../../../common/models/dto/errors';
import { FindByIdParams, DeleteParams } from '../../../common/models/dto/params';

import { CreditRequest } from '../model/creditrequest.model';
import { CreditRequestService } from '../service/creditrequest.service';

import { CreateCreditRequestDTO } from '../dto/create-credit-request';
import { FindAllCreditRequestsQuery } from '../dto/find-all-credit-requests-query';
import { UpdateCreditRequestDTO } from '../dto/update-credit-request';
import { FindAllAsesoresDto } from 'src/entities/asesores/dto/findall-query';

@Controller('creditrequest')
export class CreditRequestController {
  constructor(private readonly service: CreditRequestService, private readonly asesoreservices: asesoresservice) {}

  /**
   * #region findAll
   * 
   * @param {FindAllQuery} query 
   * @returns
   * @memberof CreditRequestController
   */

   @ApiOperation({
    summary: 'Find all Credit Requests',
    description: 'Retrieves all the current values of Credit Requests that match the selected params',
  })

  @ApiOkResponse({
    description: 'Credit Requests have been retrieved successfully',
    type: [CreditRequest],
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error in the database while trying to retrieve all Credit Requests',
    type: DatabaseErrorDto,
  })

  // #endregion findAll

  @Get()
  async findAll(@Query() query: FindAllCreditRequestsQuery) {
    return this.service.findAll(query);
  };

  /**
   * #region findById
   * 
   * @param {FindByIdParams} params
   * @returns
   * @memberof CreditRequestController
   */

  @ApiOperation({
    summary: 'Find Credit Request by ID',
    description: 'Retrieves an specific Credit Request based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Credit Request with the ID {id} has been found',
    type: CreditRequest,
  })

  @ApiNotFoundResponse({
    description: 'The Credit Request with the ID {id} was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was a database error while trying to fetch the specified Credit Request',
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
   * @param {CreateCreditRequestDTO} body
   * @returns
   * @memberof CreditRequestController
  */

  @ApiOperation({
    summary: 'Create Credit Request',
    description: 'Creates a new Credit Request',
  })

  @ApiOkResponse({
    description: 'The Credit Request has been created correctly in the database',
    type: CreditRequest,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error in the database, the Credit Request was not created',
    type: DatabaseErrorDto,
  })

  
  @Get('userall/:id')
  async getAllForUser(@Param('id') id: string){

    return this.service.findAll({userId: id})
  }


  // #endregion create
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, forbidUnknownValues: true }))
  @Post()
  async create(@Body() body: CreateCreditRequestDTO) {
    return this.service.create({ ...body });
  }

  /**
   * #region update
   * 
   * @param {FindByIdParams} params
   * @param {UpdateCreditRequestDTO} body
   * @returns
   * @memberof UseerController
   */

  @ApiOperation({
    summary: 'Update Credit Request',
    description: 'Updates a specific Credit Request based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Credit Request was updated successfully',
    type: CreditRequest,
  })

  @ApiNotFoundResponse({
    description: 'The specific Credit Request was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error while trying to update the Credit Request',
    type: DatabaseErrorDto,
  })

  // #endregion update

  @Patch(':id')
  async update(@Param() params: FindByIdParams, @Body() body: UpdateCreditRequestDTO) {
    return this.service.update(params.id, body);
  }

  /**
   * #region delete
   * 
   * @param {DeleteParams} params
   * @returns
   * @memberof CreditRequestController
   */

  @ApiOperation({
    summary: 'Delete Credit Request',
    description: 'Deletes a specific Credit Request based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Credit Request with the given ID {id} was deleted successfully',
    type: Boolean,
  })

  @ApiNotFoundResponse({
    description: 'The specific Credit Request was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error while trying to delete the Credit Request',
    type: DatabaseErrorDto,
  })

  // #endregion delete

  @Delete(':id')
  async delete(@Param() params: DeleteParams) {
    return { id: await this.service.delete(params.id) };
  }
}
