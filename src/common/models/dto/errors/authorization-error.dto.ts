import { ApiProperty } from '@nestjs/swagger';

export class AuthorizationErrorDto {
  @ApiProperty()
  errorCode: string;
  @ApiProperty()
  message: string;
}
