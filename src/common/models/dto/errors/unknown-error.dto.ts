import { ApiProperty } from '@nestjs/swagger';

export class UnknownErrorDto {
  @ApiProperty()
  errorCode: string;
  @ApiProperty()
  message: string;
}
