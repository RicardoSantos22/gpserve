import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsNotEmpty } from 'class-validator';

export class CreateNoteDTO {
  @ApiProperty({
    description: "The note's message",
    example: 'Hello World',
  })

  @IsString()
  @IsNotEmpty()
  readonly message: string;

  @ApiProperty({
    description: "The request's identifier",
    example: "6310d24dbbbe325f5bcc5b49",
  })

  @IsString()
  @IsNotEmpty()

  readonly requestId: string;
};
