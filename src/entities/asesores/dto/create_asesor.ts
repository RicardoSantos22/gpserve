import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsNumber,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';


export class CreateAsesorDTO {
    @ApiProperty({
        description: 'Name of the user',
        example: 'John Doe',
      })
    
      @IsString()
      @IsNotEmpty()
    
    readonly nombre: string;
  
    @ApiProperty({
        description: 'the days of the week to which the advisor is assigned to help users',
        example: ["Lunes" , "Martes", "Jueves", "Viernes"]
      })
    
      @IsArray()
      @IsNotEmpty()
      readonly dias: string[];
  
      @ApiProperty({
        description: 'the days of the week to which the advisor is assigned to help users',
        example: ["Lunes" , "Martes", "Jueves", "Viernes"]
      })
    
      @IsArray()
      @IsNotEmpty()
      readonly guardia: string[];
}