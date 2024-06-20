import { Injectable } from '@nestjs/common';
import { CreateRecursoDto } from '../dto/create-recurso.dto';
import { UpdateRecursoDto } from '../dto/update-recurso.dto';
import { recursosRepository } from '../repository/recursos.repository';
import { recurso } from '../model/resursos.model';
import { ConfigService } from '@nestjs/config';
import { CrudService } from 'src/common/crud/crud.service';
import { FindAllQuery } from 'src/common/models/dto/query';
import { PaginatedEntities } from 'src/common/models/paginated-entities.model';

@Injectable()
export class RecursosService extends CrudService<recurso> {


  constructor(
    protected readonly repository: recursosRepository,
    protected readonly config: ConfigService,
   
  ) {
    super(repository, 'Asesores', config);
  }
  async findAll(query: FindAllQuery): Promise<PaginatedEntities<recurso>> {
    return this.repository.findAll(query);
  }
 
}
