import { ApiProperty } from '@nestjs/swagger';

export class NotFoundErrorDto {
  @ApiProperty()
  errorCode: string;
  @ApiProperty()
  message: string;
}
