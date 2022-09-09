import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { FindAllQuery } from '../../../common/models/dto/query/find-all-query.dto';
import { CreateAsesorDTO } from '../dto/create_asesor'

export class Findallasesores extends PartialType(FindAllQuery) implements Partial<CreateAsesorDTO>{

    _id: any;

    @ApiProperty({
        description: 'Name of the user',
        example: 'John Doe',
        readOnly: true,
      })
    @IsOptional()
    nombre: any;
  
    @ApiProperty({
        description: 'the days of the week to which the advisor is assigned to help users',
        example: ["Lunes" , "Martes", "Jueves", "Viernes"],
        readOnly: true,
      })
      @IsOptional()
      dias: any;
  
      @ApiProperty({
        description: 'the days of the week to which the advisor is assigned to help users',
        example: ["Lunes" , "Martes", "Jueves", "Viernes"],
        readOnly: true,
      })
      @IsOptional()
      guardia: any;

}