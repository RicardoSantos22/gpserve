import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, isArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FindAllQuery } from '../../../common/models/dto/query/find-all-query.dto';
import { CreateAsesorDTO } from '../dto/create_asesor'

export class FindAllAsesoresDto extends PartialType(FindAllQuery) implements Partial<CreateAsesorDTO>{

  _id: any;

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
    readOnly: true,
  })

  @IsOptional()
  @IsString()
  nombre: string;

  @ApiProperty({
    description: 'the days of the week to which the advisor is assigned to help users',
    example: ["Lunes", "Martes", "Jueves", "Viernes"],
    readOnly: true,
  })

  @IsOptional()
  @IsArray()
  dias: string[];

  @ApiProperty({
    description: 'the days of the week to which the advisor is assigned to help users',
    example: ["Lunes", "Martes", "Jueves", "Viernes"],
    readOnly: true,
  })

  @IsOptional()
  @IsArray()
  guardia: string[];

}