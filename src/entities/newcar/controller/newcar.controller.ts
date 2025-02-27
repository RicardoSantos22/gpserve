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
  Req,
  UseInterceptors,
  CacheTTL,
  CacheKey,
  CacheInterceptor
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

import { NewCar } from '../model/newcar.model';
import { NewCarService } from '../service/newcar.service';

import { CreateNewCarDTO } from '../dto/create-newcar';
import { FindAllNewCarsQuery } from '../dto/find-all-newcars-query';
import { UpdateNewCarDTO } from '../dto/update-newcar';
import { NewCarGroupFilter } from '../dto/new-car-group-filter';
import { ModelsByBrandsQuery } from '../dto/models-by-brands.query';
import { Request } from 'express';

@ApiTags('newcar')
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
  @UseInterceptors(CacheInterceptor)
  @CacheKey('usedcars')
  @CacheTTL(30)
  @Get()
  async findAll(@Query() query: FindAllNewCarsQuery, @Req() req: Request) {

    let hh = new Date().toLocaleString()
    const userAgent = req.headers['user-agent'];
    console.log('se requirio de catalogo usedcars a las: ' + hh + ' Por: ' + userAgent)
    return this.service.findAll(query);
  };



    // #endregion findAll
    @UseInterceptors(CacheInterceptor)
    @CacheKey('usedcars')
    @CacheTTL(30)
    @Get('findallcars')
    async findAllcars(@Query() query: FindAllNewCarsQuery, @Req() req: Request) {
  
      let hh = new Date().toLocaleString()
      const userAgent = req.headers['user-agent'];
      console.log('se requirio de catalogo usedcars a las: ' + hh + ' Por: ' + userAgent)
      return this.service.findAllcars(query);
    };

  @Get('updatecarlist')
  async updateCarList(@Req() req: Request){
    let hh = new Date().toLocaleString()
    const userAgent = req.headers['user-agent'];
    console.log('se inicio una actualizacion de catalogo Newcars a las: ' + hh + ' Por: ' + userAgent )
    return await this.service.updateCarCatalogue();
  }

  @Get('sugerencias')
  async sugerencias()
  {
    return this.service.sugerenciasdebusqueda()
  }

  @Get('deleteDuplicateCars')
  async deleteDuplicateCars() 
  {
    return this.service.deleteduplicateCars()
  }


  @Get('getcataloguecar/:id')
  async getcataloguecar(@Param('id') id: string) {
    return this.service.getAllCatalogueCarsForId(id)
  }
  
  @Get('filters')
  async getFiltersValues() {
    return this.service.getFiltersValues()
  }

  

  @Get('getfiltercountnewcar')
  async getfiltercount(){
    return this.service.getfiltercount()
  }
  


  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, forbidUnknownValues: true }))
  @Get('filters/models')
  async getModelsByBrands(@Query() { brand }: ModelsByBrandsQuery) {
    return this.service.getModelsByBrands(brand)
  }

  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, forbidUnknownValues: true }))
  @Get('filters/newmodels')
  async getNewModelsByBrands(@Query() { brand }: ModelsByBrandsQuery) {
    return this.service.getnewmodels(brand)
  }


  @Get(':brandUrl/:modelUrl/:seriesUrl/:year/:transmision/:price')
  async getByCarGroup(@Param('brandUrl') brandUrl: string, @Param('modelUrl') modelUrl: string, @Param('seriesUrl') seriesUrl: string, @Param('year') year: string, @Param('transmision') transmision: string, @Param('price') price: number) {
    const groupFilter : NewCarGroupFilter = {
      brandUrl,
      modelUrl,
      seriesUrl,
      year,
      transmision,
      price
    }
    
    return this.service.getByCarGroup(groupFilter)
  }

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

  @Get('getpromotion/:chasis')
  async sliderpromotion(@Param('chasis') chasis: string) {
    return this.service.findfpromotions(chasis);
  }

  @Get('findforsugerencias')
  async findforsugerencias(@Query() query: FindAllNewCarsQuery,  @Req() req: Request) {

    let hh = new Date().toLocaleString()
    const userAgent = req.headers['user-agent'];
    console.log('se requirio de catalogo por sugerencias newcar a las: ' + hh + ' Por: ' + userAgent)
    return this.service.findForSugerencias(query);
  };



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
  

  @Post('busqueda')
  async busqueda(@Body() body: any)
  {
    return this.service.findForString(body)
  }

  @Post('sheets')
  async sheets(@Body() body: any)
  {
    console.log(body)

    let sheetsIDs = ['800', '802', '901', '902', '903', '904', '905', '906', '907']
    let sheets = false

    if(sheetsIDs.includes(body.agencyId))
      {
        sheets = true
      }
    
    let imageprocode: any = await this.service.verificationImageProSheets(body.vin, sheets)

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
      body.dealerId = imageprocode.dealerId
    }

    return this.service.create({ ...body });
   
  }



  @Post('setup')
  async getCarCatalogue(@Headers('Authorization') authHeader: string) {
    // return this.service.getCarCatalogue(authHeader)
    return 'Desabilitado'
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
  
    let sheetsIDs = ['800', '802', '901', '902', '903', '904', '905', '906', '907']
    let sheets = false

    if(sheetsIDs.includes(body.agencyId))
      {
        sheets = true
      }

    let imageprocode: any = await this.service.verificationImageProSheets(body.vin, sheets)

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
      body.dealerId = imageprocode.dealerId
    }


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
    console.log(params.id)
    return { id: await this.service.delete(params.id) };
  };
}
