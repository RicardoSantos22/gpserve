import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CrudService } from '../../../common/crud/crud.service';
import { BugRepository } from '../repository/bitacora.repository';
import { FindAllQuery } from 'src/common/models/dto/query';
import { PaginatedEntities } from 'src/common/models/paginated-entities.model';

let x;

@Injectable()
export class BugsService extends CrudService<typeof x> {

    setupCarsSecret: string

    sadApiConfig = {
        baseUrl: null,
        username: null,
        password: null
    }

    constructor(
        readonly repository: BugRepository,
        readonly config: ConfigService,
    ) {
        super(repository, 'UsedCar', config);
        this.sadApiConfig = {
            baseUrl: this.config.get('sadAPI.baseUrl'),
            username: this.config.get('sadAPI.username'),
            password: this.config.get('sadAPI.password')
        }
        this.setupCarsSecret = this.config.get('setupCarsSecret')
    }
    async findAll(query: FindAllQuery): Promise<PaginatedEntities<any>> {

        return await this.repository.findAll({type: 'bug'})
    }


   async findById(id: string){
        return await this.repository.findById(id)
    }

    async update(id: string, item: Partial<any>): Promise<any> {
        return await this.repository.update(id, item)
    }

    
  }
