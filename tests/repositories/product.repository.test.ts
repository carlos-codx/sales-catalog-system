import { ProductRepository } from '../../src/repositories/product.repository';
import { Product } from '../../src/models/product.model';
import { Op } from 'sequelize';

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

  it('should find products with filters, pagination and unit included', async () => {
    const mockResult = {
      count: 2,
      rows: [
        { id: 1, code: 'P001', name: 'Apple', unit: { id: 1, name: 'kg' } },
        { id: 2, code: 'P002', name: 'Banana', unit: { id: 2, name: 'kg' } },
      ],
    };

    (Product.findAndCountAll as jest.Mock).mockResolvedValue(mockResult);

    const filters = { code: 'P0', name: 'A' };
    const limit = 10;
    const offset = 0;

    const result = await repo.findAll(filters, limit, offset);

    expect(Product.findAndCountAll).toHaveBeenCalledWith({
      where: {
        code: { [Op.like]: '%P0%' },
        name: { [Op.like]: '%A%' },
      },
      include: [{ model: expect.any(Function), as: 'unit' }],
      limit,
      offset,
    });

    expect(result).toEqual(mockResult);
  });

  it('should update a product if found', async () => {
    const mockProduct = {
      id: 1,
      name: 'Old',
      update: jest.fn().mockResolvedValue(undefined),
    };

    (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

    const updatedData = { name: 'New Name' };
    const result = await repo.update(1, updatedData);

    expect(Product.findByPk).toHaveBeenCalledWith(1);
    expect(mockProduct.update).toHaveBeenCalledWith(updatedData);
    expect(result).toBe(mockProduct);
  });

  it('should return null if product to update is not found', async () => {
    (Product.findByPk as jest.Mock).mockResolvedValue(null);

    const result = await repo.update(99, { name: 'Does not exist' });

    expect(Product.findByPk).toHaveBeenCalledWith(99);
    expect(result).toBeNull();
  });

  it('should soft delete a product if found', async () => {
    const mockProduct = {
      id: 2,
      destroy: jest.fn().mockResolvedValue(undefined),
    };

    (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

    const result = await repo.softDelete(2);

    expect(Product.findByPk).toHaveBeenCalledWith(2);
    expect(mockProduct.destroy).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should return false if product to delete is not found', async () => {
    (Product.findByPk as jest.Mock).mockResolvedValue(null);

    const result = await repo.softDelete(999);

    expect(Product.findByPk).toHaveBeenCalledWith(999);
    expect(result).toBe(false);
  });

  it('should find a product by id including unit', async () => {
    const mockProduct = {
      id: 1,
      name: 'Producto con Unidad',
      unit: { id: 10, name: 'kg' }
    };

    (Product.findOne as jest.Mock).mockResolvedValue(mockProduct);

    const result = await repo.findById(1);

    expect(Product.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      include: [{ model: expect.any(Function), as: 'unit' }]
    });

    expect(result).toEqual(mockProduct);
  });

  it('should return null if product not found by id', async () => {
    (Product.findOne as jest.Mock).mockResolvedValue(null);

    const result = await repo.findById(999);

    expect(Product.findOne).toHaveBeenCalledWith({
      where: { id: 999 },
      include: [{ model: expect.any(Function), as: 'unit' }]
    });

    expect(result).toBeNull();
  });

  it('should find many products by ids with unit included', async () => {
    const ids = [1, 2, 3];
    const mockProducts = [
      { id: 1, name: 'P1' },
      { id: 2, name: 'P2' },
    ];

    (Product.findAll as jest.Mock).mockResolvedValue(mockProducts);

    const result = await repo.findManyByIds(ids);

    expect(Product.findAll).toHaveBeenCalledWith({
      where: { id: { [Op.in]: ids } },
      include: [{ model: expect.any(Function), as: 'unit' }],
    });

    expect(result).toEqual(mockProducts);
  });


});
