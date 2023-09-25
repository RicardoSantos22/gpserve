import {
  DatabaseException,
  ERROR_CREATING_DOCUMENT,
  ERROR_FINDING_DOCUMENT,
} from 'src/common/models/errors/database.errors';
import { CrudService } from '../../../common/crud/crud.service';
import { Admin } from '../model/admin.model';
import { AdminRepository } from '../repository/admin.repository';
import { CreateAdminDTO } from '../dto/create-admin.dto';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AwsS3Service } from '../../../bucket/services/aws-s3/aws-s3.service';
import e from 'express';

@Injectable()
export class AdminService extends CrudService<Admin> {

  constructor(
    readonly repository: AdminRepository,
    readonly config: ConfigService,
    readonly s3Service: AwsS3Service
  ) {
    super(repository, 'Admin', config);
  }

  async findAdminByEmail(email: string): Promise<any> {
    const admin = await this.repository.findOne({ email });
    if (!admin) {
      throw new NotFoundException(ERROR_FINDING_DOCUMENT('Admin'));
    }
    return admin;
  }


  async create(dto: CreateAdminDTO): Promise<Admin> {
    try {
      const adminValidator = await this.repository.findOne({
        email: dto.email,
      });
      if (adminValidator) {
        throw new BadRequestException('This email already exists');
      }
      const admin = await this.repository.create(dto);
      return admin;
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      throw new DatabaseException(
        ERROR_CREATING_DOCUMENT(this.name, e.message || e),
      );
    }
  }

  async updateBannersForHome( body: any, file: Express.Multer.File){

    if(!file || !file.buffer) {
      throw new BadRequestException('Invalid file provided')
    }

    const sizeInMb = file.size / 1024 / 1024
   
    if(sizeInMb > 5) {
      throw new BadRequestException('File exceeds allowed size limit')
    }

  

    try
    {
      let s3Url;

      if(body.type === 'desktop')
      { 
  
        if(body.banner === 'home')
        {
  
            s3Url = await this.s3Service.uploadBeners(`publicidad/banners/home-desktop-banner.jpg`, file.buffer, true)
          
        }
        if(body.banner === 'carlist')
        {
           s3Url = await this.s3Service.uploadBeners(`publicidad/banners/carlist-desktop-banner.jpg`, file.buffer, true)
        }
       
      }
  
      if(body.type === 'movil')
      { 
  
        if(body.banner === 'home')
        {
           s3Url = await this.s3Service.uploadBeners(`publicidad/banners/home-movil-banner.jpg`, file.buffer, true)
        }
        if(body.banner === 'carlist')
        {
           s3Url = await this.s3Service.uploadBeners(`publicidad/banners/carlist-movil-banner.jpg`, file.buffer, true)
        }
       
        
      }

      return s3Url

    }
    catch(e)
    {
      return e
    }

  }
}
