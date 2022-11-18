import { PartialType } from '@nestjs/swagger';

import { CreateAdminDTO } from './create-admin.dto';

export class UpdateAdminDTO extends PartialType(CreateAdminDTO) {};
