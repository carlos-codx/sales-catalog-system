import { ProductService } from '../../src/services/product.service';
import { ProductRepository } from '../../src/repositories/product.repository';

jest.mock('../../src/repositories/product.repository');

describe('ProductService', () => {
  const MockedRepo = ProductRepository as jest.MockedClass<typeof ProductRepository>;
  let service: ProductService;
  let mockRepo: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    mockRepo = new MockedRepo() as jest.Mocked<ProductRepository>;
    service = new ProductService();
    (service as any).productRepo = mockRepo;
  });

  it('should create a product', async () => {
    const mockProduct = { id: 1, code: 'P001', name: 'Test', description: 'lorem', price: 10, unitId: 1 };
    mockRepo.create.mockResolvedValue(mockProduct as any);

    const result = await service.createProduct(mockProduct);
    expect(result).toEqual(mockProduct);
    expect(mockRepo.create).toHaveBeenCalledWith(mockProduct);
  });

  it('should get a product by name', async () => {
    const mockProduct = { id: 2, name: 'Manzana' };
    mockRepo.findOneByName.mockResolvedValue(mockProduct as any);

    const result = await service.getProductByName('Manzana');
    expect(result).toEqual(mockProduct);
    expect(mockRepo.findOneByName).toHaveBeenCalledWith('Manzana');
  });

  it('should get a product by code', async () => {
    const mockProduct = { id: 3, code: 'P002' };
    mockRepo.findOneByCode.mockResolvedValue(mockProduct as any);

    const result = await service.getProductByCode('P002');
    expect(result).toEqual(mockProduct);
    expect(mockRepo.findOneByCode).toHaveBeenCalledWith('P002');
  });

  describe('ProductService - getAllProducts', () => {
    it('should return filtered products with pagination', async () => {
      const mockData: any = {
        rows: [{ id: 1, code: 'X1', name: 'Example', description: 'test data', price: 10, unitId: 1, unit: { name: 'kg' }, createdAt: new Date(), updatedAt: new Date() }],
        count: 1,
      };

      mockRepo.findAll.mockResolvedValue(mockData);

      const result = await service.getAllProducts({ code: 'X1' }, 10, 0);

      expect(mockRepo.findAll).toHaveBeenCalledWith({ code: 'X1' }, 10, 0);
      expect(result).toEqual(mockData);
    });
  });

});
