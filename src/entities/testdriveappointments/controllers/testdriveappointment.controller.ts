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

import { TestDriveAppointments } from '../models/testdriveappointments.model';
import { TestDriveAppointmentsService } from '../service/testdriveappointments.service';

import { CreateTestDriveAppointmentDTO } from '../dto/create-testdriveappointment';
import { FindAllTestDriveAppointmentsQuery } from '../dto/find-all-testdriveappointments-query';
import { UpdateTestDriveAppointmentDTO } from '../dto/update-testdriveappointment';

import { Findallasesores } from 'src/entities/asesores/dto/findall-query';
import { asesoresservice } from '../../asesores/service/asesores.service'


@Controller('testdriveappointment')
export class TestDriveAppointmentController {
  constructor(private readonly service: TestDriveAppointmentsService, private readonly asesoreservices: asesoresservice) {}

  /**
   * #region findAll
   * 
   * @param {FindAllQuery} query 
   * @returns
   * @memberof TestDriveAppointmentController
   */

   @ApiOperation({
    summary: 'Find all Test Drive Appointments',
    description: 'Retrieves all the current values of Test Drive Appointments that match the selected params',
  })

  @ApiOkResponse({
    description: 'Test Drive Appointments have been retrieved successfully',
    type: [TestDriveAppointments],
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error in the database while trying to retrieve all Test Drive Appointments',
    type: DatabaseErrorDto,
  })

  // #endregion findAll

  @Get()
  async findAll(@Query() query: FindAllTestDriveAppointmentsQuery) {
    return this.service.findAll(query);
  };

  /**
   * #region findById
   * 
   * @param {FindByIdParams} params
   * @returns
   * @memberof TestDriveAppointmentController
   */

  @ApiOperation({
    summary: 'Find Test Drive Appointment by ID',
    description: 'Retrieves an specific Test Drive Appointment based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Test Drive Appointment with the ID {id} has been found',
    type: TestDriveAppointments,
  })

  @ApiNotFoundResponse({
    description: 'The Test Drive Appointment with the ID {id} was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was a database error while trying to fetch the specified Test Drive Appointment',
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
   * @param {CreateTestDriveAppointmentDTO} body
   * @returns
   * @memberof TestDriveAppointmentController
  */

  @ApiOperation({
    summary: 'Create Test Drive Appointment',
    description: 'Creates a new Test Drive Appointment',
  })

  @ApiOkResponse({
    description: 'The Test Drive Appointment has been created correctly in the database',
    type: TestDriveAppointments,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error in the database, the Test Drive Appointment was not created',
    type: DatabaseErrorDto,
  })

  // #endregion create

  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, forbidUnknownValues: true }))
  @Post()
  async create(@Body() body: any) {
    let query: Findallasesores; 
    let asesor = await this.asesoreservices.getasesores(query)
    body.asesorid = asesor[0].id;
    let newbody: CreateTestDriveAppointmentDTO = body;
    return this.service.create({ ...newbody });
  }

  /**
   * #region update
   * 
   * @param {FindByIdParams} params
   * @param {UpdateTestDriveAppointmentDTO} body
   * @returns
   * @memberof UseerController
   */

  @ApiOperation({
    summary: 'Update Test Drive Appointment',
    description: 'Updates a specific Test Drive Appointment based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Test Drive Appointment was updated successfully',
    type: TestDriveAppointments,
  })

  @ApiNotFoundResponse({
    description: 'The specific Test Drive Appointment was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error while trying to update the Test Drive Appointment',
    type: DatabaseErrorDto,
  })

  // #endregion update

  @Patch(':id')
  async update(@Param() params: FindByIdParams, @Body() body: UpdateTestDriveAppointmentDTO) {
    return this.service.update(params.id, body);
  }

  /**
   * #region delete
   * 
   * @param {DeleteParams} params
   * @returns
   * @memberof TestDriveAppointmentController
   */

  @ApiOperation({
    summary: 'Delete Test Drive Appointment',
    description: 'Deletes a specific Test Drive Appointment based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Test Drive Appointment with the given ID {id} was deleted successfully',
    type: Boolean,
  })

  @ApiNotFoundResponse({
    description: 'The specific Test Drive Appointment was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error while trying to delete the Test Drive Appointment',
    type: DatabaseErrorDto,
  })

  // #endregion delete

  @Delete(':id')
  async delete(@Param() params: DeleteParams) {
    return { id: await this.service.delete(params.id) };
  };
};
