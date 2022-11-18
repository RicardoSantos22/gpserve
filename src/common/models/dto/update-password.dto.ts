import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'The current password',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6)
  current: string;

  @ApiProperty({
    description: 'The new password',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6)
  new: string;
}
