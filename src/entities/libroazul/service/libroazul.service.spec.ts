import { Test, TestingModule } from '@nestjs/testing';
import { LibroazulService } from './libroazul.service';

describe('LibroazulService', () => {
  let service: LibroazulService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LibroazulService],
    }).compile();

    service = module.get<LibroazulService>(LibroazulService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
