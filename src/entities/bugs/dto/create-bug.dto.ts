import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBugDto {

    @IsNotEmpty()
    @IsString()
    userId : string;

    @IsString()
    status : string;
}
