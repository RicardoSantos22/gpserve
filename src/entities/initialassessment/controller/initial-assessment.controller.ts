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

import { InitialAssessment } from '../model/initial-assessment.model';
import { InitialAssessmentService } from '../service/initial-assessment.service';

import { CreateInitialAssessmentDTO } from '../dto/create-initial-assessment';
import { FindAllInitialAssessmentsQuery } from '../dto/find-all-initial-assessments-query';
import { UpdateInitialAssessmentDTO } from '../dto/update-initial-assessment';

@Controller('InitialAssessment')
export class InitialAssessmentController {
  constructor(private readonly service: InitialAssessmentService) { }

  /**
   * #region findAll
   * 
   * @param {FindAllQuery} query 
   * @returns
   * @memberof InitialAssessment
   */

  @ApiOperation({
    summary: 'Find all Initial Assessments',
    description: 'Retrieves all the current values of Initial Assessments that match the selected params',
  })

  @ApiOkResponse({
    description: 'Initial Assessments have been retrieved successfully',
    type: [InitialAssessment],
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error in the database while trying to retrieve all Initial Assessments',
    type: DatabaseErrorDto,
  })

  // #endregion findAll

  @Get()
  findAll(@Query() query: FindAllInitialAssessmentsQuery) {
    return this.service.findAll(query);
  };

  /**
   * #region findById
   * 
   * @param {FindByIdParams} params
   * @returns
   * @memberof InitialAssessmentController
   */

  @ApiOperation({
    summary: 'Find Initial Assessment by ID',
    description: 'Retrieves an specific Initial Assessment based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Initial Assessment with the ID {id} has been found',
    type: InitialAssessment,
  })

  @ApiNotFoundResponse({
    description: 'The Initial Assessment with the ID {id} was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was a database error while trying to fetch the specified Initial Assessment',
    type: DatabaseErrorDto,
  })

  // #endregion findById

  @Get(':id')
  findById(@Param() params: FindByIdParams) {
    return this.service.findById(params.id);
  }

  /**
   * #region create
   * 
   * @param {CreateInitialAssessmentDTO} body
   * @returns
   * @memberof InitialAssessmentController
  */

  @ApiOperation({
    summary: 'Create Initial Assessment',
    description: 'Creates a new Initial Assessment',
  })

  @ApiOkResponse({
    description: 'The Initial Assessment has been created correctly in the database',
    type: InitialAssessment,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error in the database, the Initial Assessment was not created',
    type: DatabaseErrorDto,
  })

  // #endregion create

  @Post()
  create(@Body() body: CreateInitialAssessmentDTO) {
    return this.service.create({ ...body });
  }

  /**
   * #region update
   * 
   * @param {FindByIdParams} params
   * @param {UpdateInitialAssessmentDTO} body
   * @returns
   * @memberof UseerController
   */

  @ApiOperation({
    summary: 'Update Initial Assessment',
    description: 'Updates a specific Initial Assessment based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Initial Assessment was updated successfully',
    type: InitialAssessment,
  })

  @ApiNotFoundResponse({
    description: 'The specific Initial Assessment was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error while trying to update the Initial Assessment',
    type: DatabaseErrorDto,
  })

  // #endregion update

  @Patch(':id')
  update(@Param() params: FindByIdParams, @Body() body: UpdateInitialAssessmentDTO) {
    return this.service.update(params.id, body);
  }

  /**
   * #region delete
   * 
   * @param {DeleteParams} params
   * @returns
   * @memberof InitialAssessmentController
   */

  @ApiOperation({
    summary: 'Delete Initial Assessment',
    description: 'Deletes a specific Initial Assessment based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Initial Assessment with the given ID {id} was deleted successfully',
    type: Boolean,
  })

  @ApiNotFoundResponse({
    description: 'The specific Initial Assessment was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error while trying to delete the Initial Assessment',
    type: DatabaseErrorDto,
  })

  // #endregion delete

  @Delete(':id')
  async delete(@Param() params: DeleteParams) {
    return { id: await this.service.delete(params.id) };
  };
};
