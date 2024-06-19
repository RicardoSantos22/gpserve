import {ApiProperty, PartialType} from '@nestjs/swagger';

import {IsOptional} from 'class-validator';

import {CreateBugDto} from './create-bug.dto';

import {FindAllQuery} from '../../../common/models/dto/query/find-all-query.dto';
import {Expose} from 'class-transformer';

export class FindAllBugsQuery extends PartialType(FindAllQuery) implements Partial<CreateBugDto> {

}
