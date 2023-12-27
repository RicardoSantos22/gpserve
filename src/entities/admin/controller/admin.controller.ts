import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';

import {ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnprocessableEntityResponse} from '@nestjs/swagger';

import {DatabaseErrorDto, NotFoundErrorDto} from '../../../common/models/dto/errors';
import {DeleteParams, FindByIdParams} from '../../../common/models/dto/params';

import {Admin} from '../model/admin.model';
import {AdminService} from '../service/admin.service';

import {CreateAdminDTO} from '../dto/create-admin.dto';
import {FindAllAdminsQuery} from '../dto/find-all-admins-query';
import {UpdateAdminDTO} from '../dto/update-admin';
import {Res, UploadedFile, UseInterceptors} from '@nestjs/common/decorators';
import {SitemapStream, streamToPromise} from "sitemap";
import {NewCarService} from 'src/entities/newcar/service/newcar.service';
import {UsedCarService} from 'src/entities/usedcar/service/usedcar.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
    constructor(
        private readonly service: AdminService,
        private readonly NewCarService: NewCarService,
        private readonly UsedCarService: UsedCarService,
    ) {
    }

    /**
     * #region findAll
     *
     *
     * @param {FindAllQuery} query
     * @returns
     * @memberof AdminController
     */

    @ApiOperation({
        summary: 'Find all Admins',
        description: 'Retrieves all the current values of Admins that match the selected params',
    })

    @ApiOkResponse({
        description: 'Admins have been retrieved successfully',
        type: [Admin],
    })

    @ApiUnprocessableEntityResponse({
        description: 'There was an error in the database while trying to retrieve all Admins',
        type: DatabaseErrorDto,
    })

    // #endregion findAll

    @Get()
    async findAll(@Query() query: FindAllAdminsQuery) {
        return this.service.findAll(query);
    };

    /**
     * #region findById
     *
     * @param {FindByIdParams} params
     * @returns
     * @memberof AdminController
     */

    @ApiOperation({
        summary: 'Find Admin by ID',
        description: 'Retrieves an specific Admin based on the given ID',
    })

    @ApiOkResponse({
        description: 'The Admin with the ID {id} has been found',
        type: Admin,
    })

    @ApiNotFoundResponse({
        description: 'The Admin with the ID {id} was not found',
        type: NotFoundErrorDto,
    })

    @ApiUnprocessableEntityResponse({
        description: 'There was a database error while trying to fetch the specified Admin',
        type: DatabaseErrorDto,
    })

    @Get('jsSitemap')
    async getjsonsitemap()
    {
        let newcarslist = await this.NewCarService.getNewCars();
        let UsedCarlist = await this.UsedCarService.getallcars();

        let urls = ['https://estrenatuauto.com/',
        'https://estrenatuauto.com/concesionarias',
        'https://estrenatuauto.com/contacto',
        'https://estrenatuauto.com/vender-mi-auto',
        'https://estrenatuauto.com/carros-de-agencia',
       'https://estrenatuauto.com/autos-nuevos',
       'https://estrenatuauto.com/autos-seminuevos',
       'https://blog.estrenatuauto.com/',
       'https://blog.estrenatuauto.com/ventajas-hyundai-hb20',
       'https://blog.estrenatuauto.com/seminuevos-agencia-vs-lotes',
       'https://blog.estrenatuauto.com/ventajas-seminuevos-agencia',
       'https://blog.estrenatuauto.com/refacciones-originales-vs-genericas',
       'https://blog.estrenatuauto.com/como-ahorrar-gasolina', 
       'https://blog.estrenatuauto.com/diferencia-mantenimiento-agencia-taller',
       'https://blog.estrenatuauto.com/importancia-mantenimiento-autos',
       'https://blog.estrenatuauto.com/respaldo-estrenatuauto',
       'https://blog.estrenatuauto.com/consideraciones-comprar-auto-online',
       'https://blog.estrenatuauto.com/intencion-de-compra-vs-apartado',
       'https://blog.estrenatuauto.com/diferencias-compra-autos-online-presencial',
       'https://blog.estrenatuauto.com/showroom-digital',
       'https://blog.estrenatuauto.com/nuestro-diferenciador',
       'https://estrenatuauto.com/pickups',
       'https://estrenatuauto.com/camionetas-vans',
       'https://estrenatuauto.com/camionetas-chasis',
       'https://estrenatuauto.com/suvs',
       'https://estrenatuauto.com/carros-tipo-sedan',
       'https://estrenatuauto.com/carros-tipo-hatchback',
       'https://estrenatuauto.com/hyundai-hb20',
       'https://blog.estrenatuauto.com/razones-para-vender-tu-auto-aqui',
       'https://blog.estrenatuauto.com/razones-para-comprar-tu-auto-aqui',]


       let brads = []
       let chassisTypes = []

       for(let newcar of newcarslist.items)
       {
         let newurl = 'https://estrenatuauto.com/nuevo/' + newcar.brandUrl + '-' + newcar.modelUrl + '-' + newcar.year + '-' +newcar._id+ ''

         urls.push(newurl)

         

         if(brads.includes(newcar.brand))
         {}
         else {brads.push(newcar.brand)}

         if(chassisTypes.includes(newcar.chassisType))
         {
            chassisTypes.push(newcar.chassisType)
         }

       }

       for(let usedcar of UsedCarlist.items)
       {
        let newurl = 'https://estrenatuauto.com/seminuevo/' + usedcar.brand.toLowerCase() + '-' + usedcar.model.toLowerCase().replace(/\s+/g, '-')+ '-' +usedcar.year+ '-'+ usedcar._id + ''

        urls.push(newurl)

        if(brads.includes(usedcar.brand))
        {}
        else {brads.push(usedcar.brand)}

        if(chassisTypes.includes(usedcar.chassisType))
        {
           chassisTypes.push(usedcar.chassisType)
        }
       }

       for(let brand of brads)
       {
         let usedbrand = "https://estrenatuauto.com/autos-seminuevos/"+brand.toLowerCase()+"-seminuevos"
         let newbrand = "https://estrenatuauto.com/autos-nuevos/"+brand.toLowerCase()+"-nuevos"
         urls.push(usedbrand)
         urls.push(newbrand)
       }

       return urls
    }
    
    @Get('sitemap')
    async getsitemap(@Res() res) {


        let newcarslist = await this.NewCarService.getNewCars();
        let UsedCarlist = await this.UsedCarService.getallcars();


        'https://estrenatuauto.com/seminuevo/bmw-x1-sdrive20ia-2020-64270e38f11fd1001287e167'
        let carslist;

        res.set('Content-Type', 'text/xml');

        const SmStream = new SitemapStream({hostname: 'https://estrenatuauto.com'})
        SmStream.write({
            url: 'https://estrenatuauto.com/',
            changefreq: 'monthly',
            priority: 0.3,
            img: 'https://estrenatuauto.com/assets/images/home-desktop-lite.jpg',
            rel: 'canonical'
        })
        






        SmStream.write({url: 'https://estrenatuauto.com/concesionarias', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://estrenatuauto.com/carros-de-agencia', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://estrenatuauto.com/contacto', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://estrenatuauto.com/vender-mi-auto', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://estrenatuauto.com/autos-nuevos', rel: 'canonical', changefreq: 'monthly', priority: 0.3})

        SmStream.write({url: 'https://blog.estrenatuauto.com/', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://blog.estrenatuauto.com/ventajas-hyundai-hb20', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://blog.estrenatuauto.com/seminuevos-agencia-vs-lotes', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://blog.estrenatuauto.com/ventajas-seminuevos-agencia', rel: 'canonical', changefreq: 'monthly', priority: 0.3})

        SmStream.write({url: 'https://blog.estrenatuauto.com/seguro-autos', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://blog.estrenatuauto.com/autos-electricos-2024', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://blog.estrenatuauto.com/tendencias-diseno-2024', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://blog.estrenatuauto.com/mejores-suvs-2024', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://blog.estrenatuauto.com/marcas-automotrices-prometedoras-2024', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://blog.estrenatuauto.com/avances-tecnologia-automotriz', rel: 'canonical', changefreq: 'monthly', priority: 0.3})

        SmStream.write({url: 'https://blog.estrenatuauto.com/refacciones-originales-vs-genericas', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://blog.estrenatuauto.com/como-ahorrar-gasolina', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://blog.estrenatuauto.com/diferencia-mantenimiento-agencia-taller', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://blog.estrenatuauto.com/importancia-mantenimiento-autos', rel: 'canonical', changefreq: 'monthly', priority: 0.3})

        SmStream.write({url: 'https://blog.estrenatuauto.com/respaldo-estrenatuauto', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://blog.estrenatuauto.com/consideraciones-comprar-auto-online', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://blog.estrenatuauto.com/intencion-de-compra-vs-apartado', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://blog.estrenatuauto.com/diferencias-compra-autos-online-presencial', rel: 'canonical', changefreq: 'monthly', priority: 0.3})

        SmStream.write({url: 'https://blog.estrenatuauto.com/showroom-digital', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://blog.estrenatuauto.com/nuestro-diferenciador', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://blog.estrenatuauto.com/razones-para-vender-tu-auto-aqui', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://blog.estrenatuauto.com/razones-para-comprar-tu-auto-aqui', rel: 'canonical', changefreq: 'monthly', priority: 0.3})

        SmStream.write({url: 'https://estrenatuauto.com/pickups', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://estrenatuauto.com/camionetas-vans', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://estrenatuauto.com/camionetas-chasis', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://estrenatuauto.com/suvs', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://estrenatuauto.com/carros-tipo-sedan', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://estrenatuauto.com/carros-tipo-hatchback', rel: 'canonical', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://estrenatuauto.com/hyundai-hb20', rel: 'canonical', changefreq: 'monthly', priority: 0.3})

        let brads = []
        newcarslist.items.forEach((car: any) => {
            SmStream.write({
                url: 'https://estrenatuauto.com/nuevo/' + car.brandUrl + '-' + car.modelUrl + '-' + car.year + '-' +car._id+ '',
                changefreq: 'monthly',
                priority: 0.3,
                img: car.images[1],
                rel: 'canonical'
            })

            if(brads.includes(car.brand))
            {}
            else {brads.push(car.brand)}

        })

        UsedCarlist.items.forEach((car: any) => {
            console.log(car._id)
            SmStream.write({
                url: 'https://estrenatuauto.com/seminuevo/' + car.brand.toLowerCase() + '-' + car.model.toLowerCase().replace(/\s+/g, '-')+ '-' +car.year+ '-'+ car._id + '',
                changefreq: 'monthly',
                priority: 0.3,
                img: car.images[1],
                rel: 'canonical'
            })

            if(brads.includes(car.brand))
            {}
            else {brads.push(car.brand)}
        })

        for(let brand of brads)
        {
       
            SmStream.write({
                url: "https://estrenatuauto.com/autos-nuevos/"+brand.toLowerCase()+"-nuevos",
                changefreq: 'monthly',
                priority: 0.3,
                rel: 'canonical'
            })

            SmStream.write({
                url: "https://estrenatuauto.com/autos-seminuevos/"+brand.toLowerCase()+"-seminuevos",
                changefreq: 'monthly',
                priority: 0.3,
                rel: 'canonical'
            }) 
        }


        SmStream.end()
        streamToPromise(SmStream).then(xml => {
            res.send(xml);
        })
    }


    // #endregion findById

    @Get('banners')
    async banners()
    {
        return this.service.activebanners()
    }

    @Get('bannersadmin')
    async bannersadmin()
    {
        return this.service.bannelist()
    }


    @Get(':id')
    async findById(@Param() params: FindByIdParams) {
        return this.service.findById(params.id);
    }

    /**
     * #region create
     *
     * @param {CreateAdminDTO} body
     * @returns
     * @memberof AdminController
     */

    @ApiOperation({
        summary: 'Create Admin',
        description: 'Creates a new Admin',
    })

    @ApiOkResponse({
        description: 'The Admin has been created correctly in the database',
        type: Admin,
    })

    @ApiUnprocessableEntityResponse({
        description: 'There was an error in the database, the Admin was not created',
        type: DatabaseErrorDto,
    })


    // #endregion create

    @Post()
    async create(@Body() body: CreateAdminDTO) {
        return this.service.create({...body});
    }

    /**
     * #region update
     *
     * @param {FindByIdParams} params
     * @param {UpdateAdminDTO} body
     * @returns
     * @memberof AdminController
     */

    @ApiOperation({
        summary: 'Update Admin',
        description: 'Updates a specific Admin based on the given ID',
    })

    @ApiOkResponse({
        description: 'The Admin was updated successfully',
        type: Admin,
    })

    @ApiNotFoundResponse({
        description: 'The specific Admin was not found',
        type: NotFoundErrorDto,
    })

    @ApiUnprocessableEntityResponse({
        description: 'There was an error while trying to update the Admin',
        type: DatabaseErrorDto,
    })

    // #endregion update

    @Patch(':id')
    async update(@Param() params: FindByIdParams, @Body() body: UpdateAdminDTO) {
        return this.service.update(params.id, body);
    }

    /**
     * #region delete
     *
     * @param {DeleteParams} params
     * @returns
     * @memberof AdminController
     */

    @ApiOperation({
        summary: 'Delete Admin',
        description: 'Deletes a specific Admin based on the given ID',
    })

    @ApiOkResponse({
        description: 'The Admin with the given ID {id} was deleted successfully',
        type: Boolean,
    })

    @ApiNotFoundResponse({
        description: 'The specific Admin was not found',
        type: NotFoundErrorDto,
    })

    @ApiUnprocessableEntityResponse({
        description: 'There was an error while trying to delete the Admin',
        type: DatabaseErrorDto,
    })

    @Post('bannershome')
    @UseInterceptors(FileInterceptor('file'))
    async updateBannersHome(@UploadedFile() file, @Body() body: any){

        return this.service.updateBannersForHome(body, file)
    }


    @Post('dissablebanners')
    @UseInterceptors(FileInterceptor('file'))
    async dissablebanners( @Body() body: any){

        return this.service.disablebanners(body)
    }



    // #endregion delete

    @Delete(':id')
    async delete(@Param() params: DeleteParams) {
        return {id: await this.service.delete(params.id)};
    }
}
