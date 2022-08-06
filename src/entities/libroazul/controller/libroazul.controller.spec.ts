import { Test, TestingModule } from '@nestjs/testing';
import { LibroazulController } from './libroazul.controller';

describe('LibroazulController', () => {
  let controller: LibroazulController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibroazulController],
    }).compile();

    controller = module.get<LibroazulController>(LibroazulController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
