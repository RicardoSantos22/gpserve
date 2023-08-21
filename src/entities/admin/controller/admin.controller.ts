import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';

import {ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnprocessableEntityResponse} from '@nestjs/swagger';

import {DatabaseErrorDto, NotFoundErrorDto} from '../../../common/models/dto/errors';
import {DeleteParams, FindByIdParams} from '../../../common/models/dto/params';

import {Admin} from '../model/admin.model';
import {AdminService} from '../service/admin.service';

import {CreateAdminDTO} from '../dto/create-admin.dto';
import {FindAllAdminsQuery} from '../dto/find-all-admins-query';
import {UpdateAdminDTO} from '../dto/update-admin';
import {Res} from '@nestjs/common/decorators';
import {SitemapStream, streamToPromise} from "sitemap";
import {NewCarService} from 'src/entities/newcar/service/newcar.service';
import {UsedCarService} from 'src/entities/usedcar/service/usedcar.service';

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
            img: 'https://estrenatuauto.com/assets/images/home-desktop-lite.jpg'
        })
        SmStream.write({url: 'https://estrenatuauto.com/concesionarias', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://estrenatuauto.com/contacto', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://estrenatuauto.com/vender-mi-auto', changefreq: 'monthly', priority: 0.3})
        SmStream.write({url: 'https://estrenatuauto.com/autos-nuevos', changefreq: 'monthly', priority: 0.3})

        newcarslist.items.forEach((car: any) => {
            SmStream.write({
                url: 'https://estrenatuauto.com/nuevo/' + car.brandUrl + '-' + car.modelUrl + '-' + car.year + '-' +car._id+ '',
                changefreq: 'monthly',
                priority: 0.3,
                img: car.images[1]
            })

        })

        UsedCarlist.items.forEach((car: any) => {
            console.log(car._id)
            SmStream.write({
                url: 'https://estrenatuauto.com/seminuevo/' + car.brand.toLowerCase() + '-' + car.model.toLowerCase().replace(/\s+/g, '-')+ '-' +car.year+ '-'+ car._id + '',
                changefreq: 'monthly',
                priority: 0.3,
                img: car.images[1]
            })
        })


        SmStream.end()
        streamToPromise(SmStream).then(xml => {
            res.send(xml);
        })
    }

    // #endregion findById

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

    // #endregion delete

    @Delete(':id')
    async delete(@Param() params: DeleteParams) {
        return {id: await this.service.delete(params.id)};
    }
}
