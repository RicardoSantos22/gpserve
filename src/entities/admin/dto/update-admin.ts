import { PartialType } from '@nestjs/swagger';

import { CreateAdminDTO } from './create-admin';

export class UpdateAdminDTO extends PartialType(CreateAdminDTO) {};
