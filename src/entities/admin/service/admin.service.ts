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
import { banners } from '../model/banners.model';
import { bannersrepository } from '../repository/banners.repository';

@Injectable()
export class AdminService extends CrudService<Admin> {

  constructor(
    readonly repository: AdminRepository,
    readonly config: ConfigService,
    readonly s3Service: AwsS3Service,
    readonly bannersrepository: bannersrepository
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

  async activebanners()
  {
    return this.bannersrepository.findAll()
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
  
            s3Url = await this.s3Service.uploadBeners(`img-detalies/home-desktop-banner.jpg`, file.buffer, false)

            let bannersmodels : banners = {
            
              imgurl: 'https://estrenatuauto-public-assets.s3.amazonaws.com/img-detalies/home-desktop-banner.jpg',
              isactive: body.isactive,
              vinculo: body.vinculo
            }

            return this.bannersrepository.update('652ed60c4c25e431ac5c3853',bannersmodels)
          
        }
        if(body.banner === 'carlist')
        {
           s3Url = await this.s3Service.uploadBeners(`img-detalies/carlist-desktop-banner.jpg`, file.buffer, true)

           let bannersmodels : banners = {
            
            imgurl: 'https://estrenatuauto-public-assets.s3.amazonaws.com/img-detalies/carlist-desktop-banner.jpg',
            isactive: body.isactive,
            vinculo: body.vinculo
          }

          return this.bannersrepository.update('652ed65a4c25e431ac5c3855',bannersmodels)
        }
       
      }
  
      if(body.type === 'movil')
      { 
  
        if(body.banner === 'home')
        {
           s3Url = await this.s3Service.uploadBeners(`img-detalies/home-movil-banner.jpg`, file.buffer, true)

           let bannersmodels : banners = {
            
            imgurl: 'https://estrenatuauto-public-assets.s3.amazonaws.com/img-detalies/home-movil-banner.jpg',
            isactive: body.isactive,
            vinculo: body.vinculo
          }

          return this.bannersrepository.update('652ed6854c25e431ac5c3859',bannersmodels)
        }
        if(body.banner === 'carlist')
        {
           s3Url = await this.s3Service.uploadBeners(`img-detalies/carlist-movil-banner.jpg`, file.buffer, true)

           let bannersmodels : banners = {
            imgurl: 'https://estrenatuauto-public-assets.s3.amazonaws.com/img-detalies/carlist-movil-banner.jpg',
            isactive: body.isactive,
            vinculo: body.vinculo
          }

          return this.bannersrepository.update('652ed6814c25e431ac5c3857',bannersmodels)
        }
       
        
      }

    }
    catch(e)
    {
      return e
    }

  }
}
