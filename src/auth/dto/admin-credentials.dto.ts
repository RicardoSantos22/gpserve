import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminCredentialsDto {
  @ApiProperty({
    description: 'The admin email',
    example: 'john.doe@grupopremier.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: `The admin's password`,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
