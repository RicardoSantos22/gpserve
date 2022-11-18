import { FindAllQuery } from 'src/common/models/dto/query';
import { PaginatedEntities } from 'src/common/models/paginated-entities.model';
import { CrudService } from '../../../common/crud/crud.service';
import { CreateUserDTO } from '../dto/create-user';
import { UpdateUserWishlistDTO } from '../dto/update-user-wishlist.dto';

import { User } from '../model/user.model';
import { UserRepository } from '../repository/user.repository';

import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SelfUserResponse } from '../dto/self-user-response.dto';
import { plainToClass } from 'class-transformer';
import { UpdateUserDocuments } from '../dto/update-user-documents.dto';
import { AwsS3Service } from '../../../bucket/services/aws-s3/aws-s3.service';

@Injectable()
export class UserService extends CrudService<User> {
  
  constructor(
    readonly repository: UserRepository,
    readonly config: ConfigService,
    readonly s3Service: AwsS3Service
  ) {
    super(repository, 'User', config);
  }

  async create(user: CreateUserDTO): Promise<User> {
    const exists = await this.findByEmailAndFirebaseId(user.firebaseId, user.email)
    if(exists) throw new BadRequestException('User with given email already exists')
    return this.repository.create(user)
  }

  async findByEmailAndFirebaseId(firebaseId: string, email: string): Promise<User> {
    return this.repository.findOne({firebaseId, email})
  }

  async findAll(query: FindAllQuery): Promise<PaginatedEntities<User>> {
    return this.repository.findAll(query);
  }

  async findSelf(userId: string): Promise<SelfUserResponse> {
    const foundUser = await this.repository.findById(userId)
    const dto = plainToClass(SelfUserResponse, foundUser, { excludeExtraneousValues: true })
    dto.fullName = foundUser.getFullName()
    return dto
  }

  async updateWishlist(id: string, body: UpdateUserWishlistDTO) {
    if(body.action === 'add') {
      return this.repository.addToWishlist(id, body.carId, body.carType)
    }
    else if(body.action === 'remove') {
      return this.repository.removeFromWishlist(id, body.carId, body.carType)
    }
    else {
      throw new BadRequestException('Invalid action')
    }
  }

  async updateUserDocuments(id: string, body: UpdateUserDocuments, file: Express.Multer.File) {

    if(!file || !file.buffer) {
      throw new BadRequestException('Invalid file provided')
    }
    const sizeInMb = file.size / 1024 / 1024
    Logger.debug(sizeInMb.toFixed(2), 'receivedFileSize')
    if(sizeInMb > 5) {
      throw new BadRequestException('File exceeds allowed size limit')
    }
    const user = await this.repository.findById(id)

    const s3Url = await this.s3Service.uploadFile(`user-${id}/${file.originalname}`, file.buffer, false)

    Logger.debug(s3Url, 's3Response')

    let currentDocuments = user.documents
    if(!currentDocuments) {
      Logger.debug('no documents in user')
      let newUserDocument = {
          name: body.name,
          url: s3Url
      }
      return this.repository.addUserDocument(id, newUserDocument)
    }
    else {
      const documentIndex = currentDocuments.findIndex(d => d.name === body.name)
      if(documentIndex > -1) {
        Logger.debug('updating existing document')
        let updatedUserDocument = {
          name: body.name,
          url: s3Url
        }
        return this.repository.updateUserDocument(id, updatedUserDocument)
      }
      else {
        Logger.debug('adding new document to existing array')
        let newUserDocument = {
          name: body.name,
          url: s3Url
        }
        return this.repository.addUserDocument(id, newUserDocument)
      }
    }
  }

  async getUserDocument(id: string, documentName: string) {

    const user = await this.repository.findById(id)
    const userDocument = user.documents.find(d => d.name === documentName)
    if(!userDocument) throw new NotFoundException('User does not have requested document')
    const fileNameOnly = userDocument.url.split('amazonaws.com/')[1];
    return { url: await this.s3Service.getSignedDownloadUrl(fileNameOnly) };

  }

}
