import { ApiProperty } from '@nestjs/swagger';

export class DatabaseErrorDto {
  @ApiProperty()
  errorCode: string;
  @ApiProperty()
  message: string;
}
