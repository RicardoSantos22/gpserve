import { CrudService } from './crud.service';
import { CrudRepository } from './crud.repository';
import { ConfigService } from '@nestjs/config';
jest.mock('./crud.service');

class CrudChildService extends CrudService<any> {
  constructor(name?) {
    super(
      (jest.fn() as unknown) as CrudRepository<any>,
      name,
      (jest.fn() as unknown) as ConfigService,
    );
  }
}

describe('CrudService', () => {
  beforeEach(() => {
    (CrudService as any).mockClear();
  });
  it('should call the CrudService contructor when instantiating a child service', () => {
    const service = new CrudChildService();
    expect(CrudService).toHaveBeenCalled();
  });
});
