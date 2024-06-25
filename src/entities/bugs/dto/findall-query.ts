import {ApiProperty, PartialType} from '@nestjs/swagger';

import {IsOptional} from 'class-validator';

import {CreateBugDto} from './create-bug.dto';

import {FindAllQuery} from '../../../common/models/dto/query/find-all-query.dto';

export class FindAllBugsQuery extends PartialType(FindAllQuery) {
 
    @IsOptional()
    type: string
}