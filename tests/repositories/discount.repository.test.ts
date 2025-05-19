import { DiscountRepository } from '../../src/repositories/discount.repository';
import { Discount } from '../../src/models/discount.model';

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
});
