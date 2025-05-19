import { ProductRepository } from '../../src/repositories/product.repository';
import { Product } from '../../src/models/product.model';

jest.mock('../../src/models/product.model');

describe('ProductRepository', () => {
  const repo = new ProductRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a product', async () => {
    const mockData = { name: 'Test', code: 'P123', price: 10, unitId: 1 };
    const mockResult = { id: 1, ...mockData };
    (Product.create as jest.Mock).mockResolvedValue(mockResult);

    const result = await repo.create(mockData);
    expect(Product.create).toHaveBeenCalledWith(mockData);
    expect(result).toEqual(mockResult);
  });

  it('should find a product by name', async () => {
    const mockResult = { id: 2, name: 'Apple' };
    (Product.findOne as jest.Mock).mockResolvedValue(mockResult);

    const result = await repo.findOneByName('Apple');
    expect(Product.findOne).toHaveBeenCalledWith({ where: { name: 'Apple' } });
    expect(result).toEqual(mockResult);
  });

  it('should find a product by code', async () => {
    const mockResult = { id: 3, code: 'XYZ' };
    (Product.findOne as jest.Mock).mockResolvedValue(mockResult);

    const result = await repo.findOneByCode('XYZ');
    expect(Product.findOne).toHaveBeenCalledWith({ where: { code: 'XYZ' } });
    expect(result).toEqual(mockResult);
  });
});
