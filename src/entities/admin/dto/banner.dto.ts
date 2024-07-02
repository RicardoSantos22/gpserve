import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateViculoBanner {
  @IsString()
  @IsNotEmpty()
  readonly vinculo: string;

  @IsString()
  @IsNotEmpty()
  readonly banner: string;
}
