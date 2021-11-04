import * as mongoose from 'mongoose';
import { DocumentType } from '@typegoose/typegoose';
import { NotFoundException } from '@nestjs/common';
import { ERROR_FINDING_DOCUMENT } from '../models/errors/database.errors';

export async function throwIfNotFoundById<T>(
  id: string,
  model: mongoose.Model<DocumentType<T> & T>,
  modelName = 'Item',
) {
  const document = await model.findById(id);
  if (!document) {
    throw new NotFoundException(
      ERROR_FINDING_DOCUMENT(modelName, `element with id ${id} not found`),
    );
  }
  return <T>document.toObject();
}
