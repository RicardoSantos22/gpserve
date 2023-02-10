import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import {
  IsString,
  IsNumber,
  IsArray,
  IsNotEmpty,
  IsObject,
  ValidateNested,
} from 'class-validator';

export class TestDriveScheduleDTO {

  @IsNotEmpty()
  @IsString()
  label: string

  @IsNotEmpty()
  @IsNumber({}, {each: true})
  monday: number[]

  @IsNotEmpty()
  @IsNumber({}, {each: true})
  tuesday: number[]

  @IsNotEmpty()
  @IsNumber({}, {each: true})
  wednesday: number[]

  @IsNotEmpty()
  @IsNumber({}, {each: true})
  thursday: number[]

  @IsNotEmpty()
  @IsNumber({}, {each: true})
  friday: number[]

  @IsNotEmpty()
  @IsNumber({}, {each: true})
  saturday: number[]

  @IsNotEmpty()
  @IsNumber({}, {each: true})
  sunday: number[]

}

export class CreateAgencyDTO {
  @ApiProperty({
    description: 'The state of the Agency',
    example: 'CDMX',
  })

  @IsString()
  @IsNotEmpty()

  readonly state: string;

  @ApiProperty({
    description: 'The location of the agency',
    example: 'Some location',
  })

  @IsString()
  @IsNotEmpty()

  readonly location: string;

  @ApiProperty({
    description: "The map's reference for the Agency",
    example: 'Some image blob',
  })

  @IsString()

  readonly mapImage: string;

  @ApiProperty({
    description: 'The list of permissions for the Administrators',
    example: ['Permission 1', 'Permission 2'],
  })

  @IsArray()

  readonly permissions: string[];

  @ApiProperty({
    description: 'The number of the Agency',
    example: 1,
  })

  @IsNumber()

  readonly number: number;


  @ApiProperty({
    description: 'The bbva_node mp_node multipagos of the Agency',
    example: 1,
  })

  @IsNumber()

  readonly bbva_node: number;

  @ApiProperty({
    description: 'The email of the Agency',
    example: 'email@agency.com',
  })

  @IsString()

  readonly email: string;

  @ApiProperty({
    description: 'The availability of the Agency for inspections',
    example: { start: '10:00', end: '18:00' },
  })

  @IsObject()

  readonly inspectionHours: {
    start: string,
    end: string,
  };

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TestDriveScheduleDTO)
  testDriveHours: TestDriveScheduleDTO

  @ApiProperty({
    description: 'The available brands in the Agency',
    example: ['Range Rover', 'Corola'],
  })

  @IsArray()

  readonly brands: string[];

  @ApiProperty({
    description: 'The name of the Agency',
    example: 'Some agency name',
  })

  @IsString()
  @IsNotEmpty()

  readonly name: string;

  @ApiProperty({
    description: 'Social URLs associated with the Agency',
    example: { id: '1', urls: ['agency1.com', 'agency2.com'] },
  })

  @IsObject()

  readonly webUrls: {
    id: string,
    urls: string[],
  };
};
