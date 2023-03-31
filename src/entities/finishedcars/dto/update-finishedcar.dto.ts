import { PartialType } from '@nestjs/swagger';
import { CreateFinishedcarDto } from './create-finishedcar.dto';

export class UpdateFinishedcarDto extends PartialType(CreateFinishedcarDto) {}
