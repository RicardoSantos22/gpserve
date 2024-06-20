import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsOptional } from 'class-validator';

import { CreateRecursoDto } from './create-recurso.dto';

import { FindAllQuery } from '../../../common/models/dto/query/find-all-query.dto';

export class FindAllRecursosQuery extends PartialType(FindAllQuery) implements Partial<CreateRecursoDto> {

    @IsOptional()
    name: string
};
