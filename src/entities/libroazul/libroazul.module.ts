import { HttpModule, Module } from '@nestjs/common';
import { LibroazulService } from './service/libroazul.service';
import { LibroazulController } from './controller/libroazul.controller';

@Module({

    imports:[HttpModule],
    controllers: [LibroazulController],
    providers: [LibroazulService]

})
export class LibroazulModule {}
