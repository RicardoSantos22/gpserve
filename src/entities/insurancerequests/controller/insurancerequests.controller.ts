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

import { DatabaseErrorDto, NotFoundErrorDto } from '../../../common/models/dto/errors';
import { FindByIdParams, DeleteParams } from '../../../common/models/dto/params';

import { InsuranceRequests } from '../model/insurancerequests.model';
import { InsuranceRequestsService } from '../service/insurancerequests.service';

import { CreateInsuranceRequestDTO } from '../dto/create-insurancerequest';
import { FindAllInsuranceRequestsQuery } from '../dto/find-all-insurancerequests';
import { UpdateInsuranceRequestDTO } from '../dto/update-insurancerequest';

@Controller('insurancerequest')
export class InsuranceRequestsController {
  constructor(private readonly service: InsuranceRequestsService) {}

  /**
   * #region findAll
   * 
   * @param {FindAllQuery} query 
   * @returns
   * @memberof InsuranceRequestsController
   */

   @ApiOperation({
    summary: 'Find all Insurance Requestss',
    description: 'Retrieves all the current values of Insurance Requestss that match the selected params',
  })

  @ApiOkResponse({
    description: 'Insurance Requestss have been retrieved successfully',
    type: [InsuranceRequests],
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error in the database while trying to retrieve all Insurance Requestss',
    type: DatabaseErrorDto,
  })

  // #endregion findAll

  @Get()
  async findAll(@Query() query: FindAllInsuranceRequestsQuery) {
    return this.service.findAll(query);
  };

  /**
   * #region findById
   * 
   * @param {FindByIdParams} params
   * @returns
   * @memberof InsuranceRequestsController
   */

  @ApiOperation({
    summary: 'Find Insurance Requests by ID',
    description: 'Retrieves an specific Insurance Requests based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Insurance Requests with the ID {id} has been found',
    type: InsuranceRequests,
  })

  @ApiNotFoundResponse({
    description: 'The Insurance Requests with the ID {id} was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was a database error while trying to fetch the specified Insurance Requests',
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
   * @param {CreateInsuranceRequestsDTO} body
   * @returns
   * @memberof InsuranceRequestsController
  */

  @ApiOperation({
    summary: 'Create Insurance Requests',
    description: 'Creates a new Insurance Requests',
  })

  @ApiOkResponse({
    description: 'The Insurance Requests has been created correctly in the database',
    type: InsuranceRequests,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error in the database, the Insurance Requests was not created',
    type: DatabaseErrorDto,
  })

  // #endregion create
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, forbidUnknownValues: true }))
  @Post()
  async create(@Body() body: CreateInsuranceRequestDTO) {
    return this.service.create({ ...body });
  }

  /**
   * #region update
   * 
   * @param {FindByIdParams} params
   * @param {UpdateInsuranceRequestsDTO} body
   * @returns
   * @memberof UseerController
   */

  @ApiOperation({
    summary: 'Update Insurance Requests',
    description: 'Updates a specific Insurance Requests based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Insurance Requests was updated successfully',
    type: InsuranceRequests,
  })

  @ApiNotFoundResponse({
    description: 'The specific Insurance Requests was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error while trying to update the Insurance Requests',
    type: DatabaseErrorDto,
  })

  // #endregion update

  @Patch(':id')
  async update(@Param() params: FindByIdParams, @Body() body: UpdateInsuranceRequestDTO) {
    return this.service.update(params.id, body);
  }

  /**
   * #region delete
   * 
   * @param {DeleteParams} params
   * @returns
   * @memberof InsuranceRequestsController
   */

  @ApiOperation({
    summary: 'Delete Insurance Requests',
    description: 'Deletes a specific Insurance Requests based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Insurance Requests with the given ID {id} was deleted successfully',
    type: Boolean,
  })

  @ApiNotFoundResponse({
    description: 'The specific Insurance Requests was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error while trying to delete the Insurance Requests',
    type: DatabaseErrorDto,
  })

  // #endregion delete

  @Delete(':id')
  async delete(@Param() params: DeleteParams) {
    return { id: await this.service.delete(params.id) };
  };
};
