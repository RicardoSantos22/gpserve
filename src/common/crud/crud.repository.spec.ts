import { CrudRepository } from './crud.repository';
import { Model } from 'mongoose';

jest.mock('./crud.repository');

class CrudChildRepository extends CrudRepository<any> {
  constructor() {
    super((jest.fn() as unknown) as Model<any>, 'test');
  }
}

describe('CrudRepository', () => {
  beforeEach(() => {
    (CrudRepository as any).mockClear();
  });
  it('should call the CrudRepository constructor when instantiating a child repository', () => {
    const service = new CrudChildRepository();
    expect(CrudRepository).toHaveBeenCalled();
  });
});
