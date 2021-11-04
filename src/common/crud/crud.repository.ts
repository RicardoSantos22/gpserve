import { Logger, NotFoundException } from '@nestjs/common';
import { DocumentType } from '@typegoose/typegoose';
import aqp from 'api-query-params';

import { PaginatedEntities } from '../models/paginated-entities.model';
import { ERROR_FINDING_DOCUMENT } from '../models/errors/database.errors';
import {
  CreateQuery,
  FilterQuery,
  Model,
  ModelUpdateOptions,
  UpdateQuery,
} from 'mongoose';
import { FindAllQuery } from '../models/dto/query/find-all-query.dto';

export abstract class CrudRepository<T> {
  protected readonly logger: Logger;

  constructor(
    protected readonly model: Model<DocumentType<T> & T>,
    protected name: string,
  ) {
    this.logger = new Logger(`${name}Repository`);
    this.model = model;
  }

  async findAll(query?: FindAllQuery): Promise<PaginatedEntities<T>> {
    const { filter, skip, limit, sort, projection } = aqp(query);
    const count = await this.model
      .find(filter)
      .countDocuments()
      .exec();
    const results = await this.model
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection)
      .exec();
    const items = results.map((r: any) => r.toObject()) as T[];
    return {
      items,
      count,
      limit,
      skip,
    };
  }

  async findById(
    id: string,
    options: {
      populateFields?: string;
      selectPopulatedFields?: string;
      selectFields?: string;
    } = { populateFields: '', selectPopulatedFields: '', selectFields: '' },
  ): Promise<T> {
    const item = !!options.populateFields
      ? await this.model
          .findById(id)
          .populate(options.populateFields.split(',').map(el => ({ path: el })))
          .select(options.selectFields)
          .exec()
      : await this.model
          .findById(id)
          .select(options.selectFields)
          .exec();
    if (!item) {
      throw new NotFoundException(
        ERROR_FINDING_DOCUMENT(this.name, `element with id ${id} not found`),
      );
    }
    return item.toObject();
  }

  async findOne(query?: FilterQuery<T>): Promise<T> {
    const item = await this.model.findOne(query as any).exec();
    return !!item ? item.toObject() : undefined;
  }

  async create(item: CreateQuery<Partial<T>>): Promise<T> {
    const result = await this.model.create(item);
    return result.toObject();
  }

  async createMany(items: Array<Partial<T>>): Promise<T[]> {
    const results = await this.model.insertMany(items);
    return results.map(r => r.toObject());
  }

  async update(id: string, item: Partial<T>): Promise<T> {
    const setMap: any = {};
    const updatedItem: any = {};
    for (const key in item) {
      if (typeof item[key] === 'object') {
        // tslint:disable-next-line: forin
        for (const key2 in item[key]) {
          setMap[`${key}.${key2}`] = item[key][key2];
        }
      } else {
        updatedItem[`${key}`] = item[key];
      }
    }
    if (Object.keys(setMap).length > 0) {
      updatedItem.$set = { ...setMap };
    }
    const result = await this.model
      .findByIdAndUpdate(id, updatedItem, { new: true })
      .exec();
    return result.toObject();
  }

  async updateMany(
    conditions: FilterQuery<T>,
    item: UpdateQuery<T>,
    options?: ModelUpdateOptions | null,
  ): Promise<T[]> {
    const results = await this.model
      .updateMany(conditions as any, item as any, options)
      .exec();
    return results.map(r => r.toObject());
  }

  async delete(id: string): Promise<boolean> {
    await this.model.findByIdAndDelete(id).exec();
    return true;
  }

  async deleteMany(condition: any): Promise<{ affected: number }> {
    const affected = (await this.model.deleteMany(condition).exec()).n;
    return { affected };
  }
}
