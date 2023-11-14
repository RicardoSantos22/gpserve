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
  ApiTags,
  ApiUnprocessableEntityResponse
} from '@nestjs/swagger';

import { DatabaseErrorDto, NotFoundErrorDto } from '../../../common/models/dto/errors';
import { FindByIdParams, DeleteParams } from '../../../common/models/dto/params';

import { InspectionAppointment } from '../model/inspectionappointment.model';
import { InspectionAppointmentService } from '../service/inspectionappointment.service';

import { CreateInspectionAppointmentDTO } from '../dto/create-inspection-appointment';
import { FindAllInspectionAppointmentsQuery } from '../dto/find-all-inspection-appointments-query';
import { UpdateInspectionAppointmentDTO } from '../dto/update-inspection-appointment';

@ApiTags('inspectionappointment')
@Controller('inspectionappointment')
export class InspectionAppointmentController {
  constructor(private readonly service: InspectionAppointmentService) {}

  /**
   * #region findAll
   * 
   * @param {FindAllQuery} query 
   * @returns
   * @memberof InspectionAppointmentController
   */

   @ApiOperation({
    summary: 'Find all Inspection Appointments',
    description: 'Retrieves all the current values of Inspection Appointments that match the selected params',
  })

  @ApiOkResponse({
    description: 'Inspection Appointments have been retrieved successfully',
    type: [InspectionAppointment],
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error in the database while trying to retrieve all Inspection Appointments',
    type: DatabaseErrorDto,
  })

  // #endregion findAll

  @Get()
  async findAll(@Query() query: FindAllInspectionAppointmentsQuery) {
    return this.service.findAll(query);
  };

  /**
   * #region findById
   * 
   * @param {FindByIdParams} params
   * @returns
   * @memberof InspectionAppointmentController
   */

  @ApiOperation({
    summary: 'Find Inspection Appointment by ID',
    description: 'Retrieves an specific Inspection Appointment based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Inspection Appointment with the ID {id} has been found',
    type: InspectionAppointment,
  })

  @ApiNotFoundResponse({
    description: 'The Inspection Appointment with the ID {id} was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was a database error while trying to fetch the specified Inspection Appointment',
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
   * @param {CreateInspectionAppointmentDTO} body
   * @returns
   * @memberof InspectionAppointmentController
  */

  @ApiOperation({
    summary: 'Create Inspection Appointment',
    description: 'Creates a new Inspection Appointment',
  })

  @ApiOkResponse({
    description: 'The Inspection Appointment has been created correctly in the database',
    type: InspectionAppointment,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error in the database, the Inspection Appointment was not created',
    type: DatabaseErrorDto,
  })

  @Get('userall/:id')
  async getAllForUser(@Param('id') id: string){

    return this.service.findAll({userId: id})
  }

  // #endregion create

  @Post()
  async create(@Body() body: CreateInspectionAppointmentDTO) {
    return this.service.create({ ...body });
  }

  /**
   * #region update
   * 
   * @param {FindByIdParams} params
   * @param {UpdateInspectionAppointmentDTO} body
   * @returns
   * @memberof UseerController
   */

  @ApiOperation({
    summary: 'Update Inspection Appointment',
    description: 'Updates a specific Inspection Appointment based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Inspection Appointment was updated successfully',
    type: InspectionAppointment,
  })

  @ApiNotFoundResponse({
    description: 'The specific Inspection Appointment was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error while trying to update the Inspection Appointment',
    type: DatabaseErrorDto,
  })

  // #endregion update

  @Patch(':id')
  async update(@Param() params: FindByIdParams, @Body() body: UpdateInspectionAppointmentDTO) {
    return this.service.update(params.id, body);
  }

  /**
   * #region delete
   * 
   * @param {DeleteParams} params
   * @returns
   * @memberof InspectionAppointmentController
   */

  @ApiOperation({
    summary: 'Delete Inspection Appointment',
    description: 'Deletes a specific Inspection Appointment based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Inspection Appointment with the given ID {id} was deleted successfully',
    type: Boolean,
  })

  @ApiNotFoundResponse({
    description: 'The specific Inspection Appointment was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error while trying to delete the Inspection Appointment',
    type: DatabaseErrorDto,
  })

  // #endregion delete

  @Delete(':id')
  async delete(@Param() params: DeleteParams) {
    return { id: await this.service.delete(params.id) };
  };
};
