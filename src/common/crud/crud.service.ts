import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import {
  FilterQuery,
  ModelUpdateOptions,
  UpdateQuery,
} from 'mongoose';
import { ConfigService } from '@nestjs/config';

import { CrudRepository } from './crud.repository';

import { FindAllQuery } from '../models/dto/query/find-all-query.dto';
import {
  DatabaseException,
  ERROR_CREATING_DOCUMENT,
  ERROR_CREATING_DOCUMENTS,
  ERROR_DELETING_DOCUMENT,
  ERROR_DELETING_DOCUMENTS,
  ERROR_FINDING_DOCUMENT,
  ERROR_RETRIEVING_DOCUMENTS,
  ERROR_UPDATING_DOCUMENT,
  ERROR_UPDATING_DOCUMENTS,
} from '../models/errors/database.errors';
import { PaginatedEntities } from '../models/paginated-entities.model';

export abstract class CrudService<T> {
  protected logger: Logger;

  constructor(
    protected readonly repository: CrudRepository<T>,
    protected readonly name: string,
    protected readonly config: ConfigService,
  ) {
    this.logger = new Logger(`${name}Service`);
  }

  /**
   * Finds all elements in the database by leveraging mongoose and api-query-params
   * [api-query-params](https://github.com/loris/api-query-params).
   *
   * @param query - the api-query-param config query
   * For example:
   * ```typescript
   * const items = await findAll({skip: 5, limit: 25});
   * console.table(items);
   *
   * ```
   * @see [api-query-params README](https://raw.githubusercontent.com/loris/api-query-params/master/README.md)
   *
\   */
  async findAll(query: FindAllQuery): Promise<PaginatedEntities<T>> {
    try {
      return await this.repository.findAll(query);
    } catch (e) {
      throw new DatabaseException(ERROR_RETRIEVING_DOCUMENTS(this.name, e));
    }
  }

  /**
   *
   * @param id - the id of the document
   * @param options - projection options
   */
  async findById(
    id: string,
    options?: {
      populateFields?: string;
      selectPopulatedFields?: string;
      selectFields?: string;
    },
  ): Promise<T> {
    try {
      if (!id) {
        throw new BadRequestException('No proper ID provided');
      }
      return this.repository.findById(id, options);
    } catch (e) {
      if (e instanceof NotFoundException || e instanceof BadRequestException) {
        throw e;
      } else {
        throw new DatabaseException(ERROR_FINDING_DOCUMENT(this.name));
      }
    }
  }

  /**
   *
   * @param item - the creation data
   */
  async create(item: any): Promise<T> {
    try {
      return await this.repository.create(item);
    } catch (e) {
      this.logger.error(e);
      if (e instanceof BadRequestException) {
        throw e;
      }
      if (this.config.get('values.NODE_ENV') === 'development') {
        throw new DatabaseException(
          ERROR_CREATING_DOCUMENT(this.name, e.message || e),
        );
      } else {
        throw new DatabaseException(ERROR_CREATING_DOCUMENT(this.name));
      }
    }
  }

  /**
   *
   * @param items - the items to create
   */
  async createMany(items: Array<Partial<T>>): Promise<T[]> {
    if (items.length === 0) {
      throw new BadRequestException(
        ERROR_CREATING_DOCUMENTS(this.name, 'specified item list is empty'),
      );
    }
    try {
      return await this.repository.createMany(items);
    } catch (e) {
      this.logger.error(e);
      throw new DatabaseException(ERROR_CREATING_DOCUMENTS(this.name));
    }
  }

  /**
   *
   * @param id - the id of the document to update
   * @param item  - the data to update the document with
   */
  async update(id: string, item: Partial<T>): Promise<T> {
    await this.repository.findById(id);
    try {
      return await this.repository.update(id, item);
    } catch (e) {
      this.logger.error(e);
      throw new DatabaseException(ERROR_UPDATING_DOCUMENT(this.name));
    }
  }

  /**
   *
   * @param conditions - the filter conditions that match the documents to update
   * @param item - the data to update the documents with
   * @param options - update options
   */
  // async updateMany(
  //   conditions: FilterQuery<T>,
  //   item: UpdateQuery<T>,
  //   options?: ModelUpdateOptions | null,
  // ): Promise<T[]> {
  //   try {
  //     return await this.repository.updateMany(conditions, item, options);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new DatabaseException(ERROR_UPDATING_DOCUMENTS(this.name));
  //   }
  // }

  /**
   *
   * @param id - the id of the document to delete
   */
  async delete(id: string): Promise<any> {
    await this.repository.findById(id);
    try {
      await this.repository.delete(id);
      return id;
    } catch (e) {
      this.logger.error(e);
      throw new DatabaseException(ERROR_DELETING_DOCUMENT(this.name));
    }
  }

  /**
   *
   * @param condition - the filter conditions to delete items that match
   */
  async deleteMany(condition: any): Promise<{ affected: number }> {
    try {
      return await this.repository.deleteMany(condition);
    } catch (e) {
      this.logger.error(e);
      throw new DatabaseException(ERROR_DELETING_DOCUMENTS(this.name));
    }
  }
}
