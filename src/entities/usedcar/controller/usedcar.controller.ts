import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
  Req
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

import { UsedCar } from '../model/usedcar.model';
import { UsedCarService } from '../service/usedcar.service';

import { CreateUsedCarDTO } from '../dto/create-usedcar';
import { FindAllUsedCarsQuery } from '../dto/find-all-usedcars-query';
import { UpdateUsedCarDTO } from '../dto/update-usedcar';
import { ModelsByBrandsQuery } from '../../newcar/dto/models-by-brands.query';
import { Request } from 'express';


@ApiTags('usedcar')
@Controller('usedcar')
export class UsedCarController {
  constructor(private readonly service: UsedCarService) {}

  /**
  * #region findAll
  * 
  * @param {FindAllQuery} query 
  * @returns
  * @memberof UsedCarController
  */

  @ApiOperation({
    summary: 'Find all Used Cars',
    description: 'Retrieves all the current values of Used Cars that match the selected params',
  })

  @ApiOkResponse({
    description: 'Used Cars have been retrieved successfully',
    type: [UsedCar],
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error in the database while trying to retrieve all Used Cars',
    type: DatabaseErrorDto,
  })

  // #endregion findAll
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  async findAll(@Query() query: FindAllUsedCarsQuery,  @Req() req: Request) {

    let hh = new Date().toLocaleString()
    const userAgent = req.headers['user-agent'];
    console.log('se requirio de catalogo newcar a las: ' + hh + ' Por: ' + userAgent)
    return this.service.findAll(query);
  };

  @Get('updatecarlist')
  async updateCarList(@Req() req: Request){

    let hh = new Date().toLocaleString()
    const userAgent = req.headers['user-agent'];
    console.log('se inicio una actualizacion de catalogo newcar a las: ' + hh + ' Por: ' + userAgent )
    return await this.service.updateCarCatalogue();
  }

  @Get('sugerencias')
  async sugerencias()
  {
    return this.service.sugerenciasdebusqueda()
  }

  @Get('verificacionimagepro')
  async verificacionimagepro()
  {
    return this.service.verificationImagePro('3MX4M4HB5LW011994', true)
  }

  @Get('miip')
  async miip()
  {
    
    return this.service.getip()
  }
  

  @Get('deleteDuplicateCars')
  async deleteDuplicateCars() 
  {
    return this.service.deleteduplicateCars()
  }

  @Get('getpromotion/:chasis')
  async sliderpromotion(@Param('chasis') chasis: string) {
    return this.service.findfpromotions(chasis);
  }
  

  @Get('filters')
  async getFiltersValues() {
    return this.service.getFiltersValues()
  }

  @Get('getfiltercountusedcar')
  async getfiltercount(){
    return this.service.getfiltercount()
  }
  

  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, forbidUnknownValues: true }))
  @Get('filters/models')
  async getModelsByBrands(@Query() { brand }: ModelsByBrandsQuery) {
    return this.service.getModelsByBrands(brand)
  }

  /**
   * #region findById
   * 
   * @param {FindByIdParams} params
   * @returns
   * @memberof UsedCarController
   */

  @ApiOperation({
    summary: 'Find Inspection Appointment by ID',
    description: 'Retrieves an specific Inspection Appointment based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Inspection Appointment with the ID {id} has been found',
    type: UsedCar,
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

  @Get('vin/:vin')
  async findByvin(@Param('vin') vin: string) {
    return this.service.getcarbyvin(vin)
  }




  /**
   * #region create
   * 
   * @param {CreateUsedCarDTO} body
   * @returns
   * @memberof UsedCarController
  */

  @ApiOperation({
    summary: 'Create Inspection Appointment',
    description: 'Creates a new Inspection Appointment',
  })

  @ApiOkResponse({
    description: 'The Inspection Appointment has been created correctly in the database',
    type: UsedCar,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error in the database, the Inspection Appointment was not created',
    type: DatabaseErrorDto,
  })

  // #endregion create

  @Post()
  async create(@Body() body: CreateUsedCarDTO) {
    return this.service.create({ ...body });
  }


  @Post('bmw')
  async BMW(@Body() body: CreateUsedCarDTO) {

    let sheetsIDs = ['800', '802', '901', '902', '903', '904', '905', '906', '907']
    let sheets = false

    if(sheetsIDs.includes(body.agencyId))
      {
        sheets = true
      }
    
    let imageprocode: any = await this.service.verificationImagePro(body.vin, sheets)

    if(imageprocode.status === false)
    {
      let code:any = await this.service.imgVerfication(body)
      body.status = code
    }
    else
    {
      body.imgProStatus  = imageprocode.status
      body.ImgProImg = imageprocode.img
      body.status = 'online'
    }

    return this.service.create({ ...body });
   
  }

  @Post('busqueda')
  async busqueda(@Body() body: any)
  {
    return this.service.findForString(body)
  }

  @Post('setup')
  async getUsedCarCatalogue(@Headers('Authorization') authHeader: string) {
    // return this.service.getUsedCarCatalogue(authHeader)
    return 'Desabilitado'
  }

  /**
   * #region update
   * 
   * @param {FindByIdParams} params
   * @param {UpdateUsedCarDTO} body
   * @returns
   * @memberof UseerController
   */

  @ApiOperation({
    summary: 'Update Inspection Appointment',
    description: 'Updates a specific Inspection Appointment based on the given ID',
  })

  @ApiOkResponse({
    description: 'The Inspection Appointment was updated successfully',
    type: UsedCar,
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
  async update(@Param() params: FindByIdParams, @Body() body: UpdateUsedCarDTO) {
    
    let sheetsIDs = ['800', '802', '901', '902', '903', '904', '905', '906', '907']
    let sheets = false

    if(sheetsIDs.includes(body.agencyId))
      {
        sheets = true
      }

    let imageprocode: any = await this.service.verificationImagePro(body.vin, sheets)

    if(imageprocode.status === false)
    {
      let code:any = await this.service.imgVerfication(body)
      body.status = code
    }
    else
    {
      body.imgProStatus  = imageprocode.status
      body.ImgProImg = imageprocode.img
      body.status = 'online'
    }

    console.log(body)
    console.log("________________________________________")

    return this.service.update(params.id, body);

  }

  /**
   * #region delete
   * 
   * @param {DeleteParams} params
   * @returns
   * @memberof UsedCarController
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
