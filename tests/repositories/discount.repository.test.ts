import { DiscountRepository } from '../../src/repositories/discount.repository';
import { Discount } from '../../src/models/discount.model';
import { Product } from '../../src/models/product.model';

jest.mock('../../src/models/discount.model');

describe('DiscountRepository', () => {
  const repo = new DiscountRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a discount', async () => {
    const input: any = {
      productId: 1,
      value: 20,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      type: 'PERCENTAGE',
      status: 'ACTIVE',
    };

    const mockDiscount = { id: 1, ...input };
    (Discount.create as jest.Mock).mockResolvedValue(mockDiscount);

    const result = await repo.create(input);

    expect(Discount.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockDiscount);
  });

  it('should find one discount by given field(s)', async () => {
    const mockDiscount = {
      productId: 1,
      value: 20,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      type: 'PERCENTAGE',
      status: 'ACTIVE',
    };

    (Discount.findOne as jest.Mock).mockResolvedValue(mockDiscount);

    const result = await repo.findOne({ productId: 5 });

    expect(Discount.findOne).toHaveBeenCalledWith({
      where: { productId: 5 },
    });

    expect(result).toEqual(mockDiscount);
  });

  it('should return null if no discount found', async () => {
    (Discount.findOne as jest.Mock).mockResolvedValue(null);

    const result = await repo.findOne({ productId: 999 });

    expect(Discount.findOne).toHaveBeenCalledWith({
      where: { productId: 999 },
    });

    expect(result).toBeNull();
  });

  it('should update discount status if found', async () => {
    const mockDiscount = {
      id: 1,
      status: 'INACTIVE',
      save: jest.fn().mockResolvedValue(undefined),
    };

    (Discount.findByPk as jest.Mock).mockResolvedValue(mockDiscount);

    const repo = new DiscountRepository();
    const result = await repo.updateStatus(1, 'ACTIVE');

    expect(Discount.findByPk).toHaveBeenCalledWith(1);
    expect(mockDiscount.status).toBe('ACTIVE');
    expect(mockDiscount.save).toHaveBeenCalled();
    expect(result).toBe(mockDiscount);
  });

  it('should return null if discount is not found by id', async () => {
    (Discount.findByPk as jest.Mock).mockResolvedValue(null);

    const repo = new DiscountRepository();
    const result = await repo.updateStatus(999, 'INACTIVE');

    expect(Discount.findByPk).toHaveBeenCalledWith(999);
    expect(result).toBeNull();
  });

  it('should find all discounts with productId filter and pagination', async () => {
    const mockResult = {
      count: 2,
      rows: [
        { id: 1, productId: 1, value: 10, product: { id: 1, name: 'Test Product' } },
        { id: 2, productId: 1, value: 15, product: { id: 1, name: 'Test Product' } },
      ],
    };

    (Discount.findAndCountAll as jest.Mock).mockResolvedValue(mockResult);

    const result = await repo.findAll(1, 10, 0);

    expect(Discount.findAndCountAll).toHaveBeenCalledWith({
      where: { productId: 1 },
      include: [{ model: Product, as: 'product' }],
      limit: 10,
      offset: 0,
    });

    expect(result).toEqual(mockResult);
  });

  it('should find all discounts without filters', async () => {
    const mockResult = {
      count: 1,
      rows: [{ id: 3, productId: 2, value: 5 }],
    };

    (Discount.findAndCountAll as jest.Mock).mockResolvedValue(mockResult);

    const result = await repo.findAll();

    expect(Discount.findAndCountAll).toHaveBeenCalledWith({
      where: {},
      include: [{ model: Product, as: 'product' }],
      limit: undefined,
      offset: undefined,
    });

    expect(result).toEqual(mockResult);
  });

});
