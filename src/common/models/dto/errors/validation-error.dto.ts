import { ApiProperty } from '@nestjs/swagger';

export class ValidationItemDto {
  @ApiProperty()
  target: Map<string, any>;
  @ApiProperty()
  value: any;
  @ApiProperty()
  property: string;
  @ApiProperty()
  children: [];
  // tslint:disable-next-line: object-literal-key-quotes
  @ApiProperty()
  constraints: Map<string, string>;
}

// tslint:disable-next-line: max-classes-per-file
export class ValidationErrorDto {
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  error: string;
  @ApiProperty()
  message: ValidationItemDto[];
}
