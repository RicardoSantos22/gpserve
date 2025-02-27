import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
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

import { User } from '../model/user.model';
import { UserService } from '../service/user.service';

import { CreateUserDTO } from '../dto/create-user';
import { FindAllUsersQuery } from '../dto/find-all-users-query';
import { UpdateUserDTO } from '../dto/update-user';
import { AuthenticatedUser } from '../../../common/decorators/user.decorator';
import { ValidatedUser } from '../../../auth/strategies/jwt.strategy';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { UpdateUserWishlistDTO } from '../dto/update-user-wishlist.dto';
import { SelfUserResponse } from '../dto/self-user-response.dto';
import { UpdateUserDocuments } from '../dto/update-user-documents.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Multer } from 'multer';


@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  /**
   * #region findAll
   * 
   * @param {FindAllQuery} query 
   * @returns
   * @memberof UserController
   */

  @ApiOperation({
    summary: 'Find all Users',
    description: 'Retrieves all the current values of Users that match the selected params',
  })

  @ApiOkResponse({
    description: 'Users have been retrieved successfully',
    type: [User],
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error in the database while trying to retrieve all users',
    type: DatabaseErrorDto,
  })

  // #endregion findAll

  @Get()
  async findAll(@Query() query: FindAllUsersQuery) {
    return this.service.findAll(query);
  };

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findSelf(@AuthenticatedUser() user: ValidatedUser): Promise<SelfUserResponse> {
    return this.service.findSelf(user.id)
  }

  /**
   * #region findById
   * 
   * @param {FindByIdParams} params
   * @returns
   * @memberof UserController
   */


  @ApiOperation({
    summary: 'Find User by ID',
    description: 'Retrieves an specific User based on the given ID',
  })

  @ApiOkResponse({
    description: 'The User with the ID {id} has been found',
    type: User,
  })

  @ApiNotFoundResponse({
    description: 'The User with the ID {id} was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was a database error while trying to fetch the specified User',
    type: DatabaseErrorDto,
  })


  @Get('myhistorial/:iduser')
  async findmyMovements(@Param('iduser') iduser: string){

    return this.service.findMyIntentions(iduser);
   
  }
  // #endregion findById

  @Get(':id')
  async findById(@Param() params: FindByIdParams) {
    return this.service.findById(params.id);
  }

  @Get(':id/document')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findUserDocument(@Param() params: FindByIdParams, @Query() query: UpdateUserDocuments) {
    return this.service.getUserDocument(params.id, query.name);
  }


  /**
   * #region create
   * 
   * @param {CreateUserDTO} body
   * @returns
   * @memberof UserController
  */

  @ApiOperation({
    summary: 'Create User',
    description: 'Creates a new User',
  })

  @ApiOkResponse({
    description: 'The user has been created correctly in the database',
    type: User,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error in the database, the user was not created',
    type: DatabaseErrorDto,
  })


  @Post('actualizarintencion')
  async updateintencion(@Body() body: any)
  {

    return await this.service.updateintencion(body);
  }

  // #endregion create
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, forbidUnknownValues: true }))
  @Post()
  async create(@Body() body: CreateUserDTO) {
    return this.service.create(body);
  }

  /**
   * #region update
   * 
   * @param {FindByIdParams} params
   * @param {UpdateUserDTO} body
   * @returns
   * @memberof UseerController
   */

  @ApiOperation({
    summary: 'Update User',
    description: 'Updates a specific User based on the given ID',
  })

  @ApiOkResponse({
    description: 'The user was updated successfully',
    type: User,
  })

  @ApiNotFoundResponse({
    description: 'The specific User was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error while trying to update the User',
    type: DatabaseErrorDto,
  })

  // #endregion update

  @Patch(':id')
  async update(@Param() params: FindByIdParams, @Body() body: UpdateUserDTO) {
    return this.service.update(params.id, body);
  }

  @Patch('updategoogleuser/:id')
  async updategoogleuser(@Param() params: FindByIdParams, @Body() body: UpdateUserDTO) {

    let BDID = await this.service.findByFirebaseid(params.id)
    return this.service.update(BDID._id, {phone: body.phone, zipCode: body.zipCode});
  }

  


  @UsePipes(new ValidationPipe({ transform: true }))
  @Patch(':id/wishlist')
  async updateUserWishlist(@Param() params: FindByIdParams, @Body() body: UpdateUserWishlistDTO) {
    return this.service.updateWishlist(params.id, body);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FileInterceptor('documento'))
  @Patch(':id/documents')
  async updateUserDocuments(@Param() params: FindByIdParams, @Query() query: UpdateUserDocuments, @UploadedFile() file: Express.Multer.File) {
    return this.service.updateUserDocuments(params.id, query, file);
  }

  /**
   * #region delete
   * 
   * @param {DeleteParams} params
   * @returns
   * @memberof UserController
   */

  @ApiOperation({
    summary: 'Delete User',
    description: 'Deletes a specific User based on the given ID',
  })

  @ApiOkResponse({
    description: 'The User with the given ID {id} was deleted successfully',
    type: Boolean,
  })

  @ApiNotFoundResponse({
    description: 'The specific User was not found',
    type: NotFoundErrorDto,
  })

  @ApiUnprocessableEntityResponse({
    description: 'There was an error while trying to delete the User',
    type: DatabaseErrorDto,
  })

  // #endregion delete

  @Delete(':id')
  async delete(@Param() params: DeleteParams) {
    return { id: await this.service.delete(params.id) };
  }
};
