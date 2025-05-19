import { DiscountService } from '../../src/services/discount.service';
import { DiscountRepository } from '../../src/repositories/discount.repository';
import { CreateDiscountInput } from '../../src/utils/validators/discount.validators';

jest.mock('../../src/repositories/discount.repository');

describe('DiscountService', () => {
  const MockedRepo = DiscountRepository as jest.MockedClass<typeof DiscountRepository>;
  let service: DiscountService;
  let mockRepo: jest.Mocked<DiscountRepository>;

  beforeEach(() => {
    mockRepo = new MockedRepo() as jest.Mocked<DiscountRepository>;
    service = new DiscountService();
    (service as any).discountRepo = mockRepo;
  });

  it('should create a discount and convert date strings to Date objects', async () => {
    const input: CreateDiscountInput = {
      productId: 1,
      value: 10,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'ACTIVE',
      type: 'PERCENTAGE',
    };

    const expectedDiscount = {
      id: 1,
      productId: 1,
      value: 10,
      type: 'PERCENTAGE',
      status: 'ACTIVE',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
    };

    mockRepo.create.mockResolvedValue(expectedDiscount as any);

    const result = await service.createDiscount(input);

    expect(mockRepo.create).toHaveBeenCalledWith({
      productId: 1,
      value: 10,
      type: 'PERCENTAGE',
      status: 'ACTIVE',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
    });

    expect(result).toEqual(expectedDiscount);
  });

  it('should get discount by productId', async () => {
    const discount = {
      id: 1,
      productId: 10,
      amount: 15,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-01'),
    };

    mockRepo.findOne.mockResolvedValue(discount as any);

    const result = await service.getDiscountByProductId(10);

    expect(mockRepo.findOne).toHaveBeenCalledWith({ productId: 10 });
    expect(result).toEqual(discount);
  });

  it('should activate a discount', async () => {
    const mockDiscount = {
      id: 1,
      status: 'ACTIVE',
    };

    mockRepo.updateStatus.mockResolvedValue(mockDiscount as any);

    const result = await service.activateDiscount(1);

    expect(mockRepo.updateStatus).toHaveBeenCalledWith(1, 'ACTIVE');
    expect(result).toEqual(mockDiscount);
  });

  it('should deactivate a discount', async () => {
    const mockDiscount = {
      id: 2,
      status: 'INACTIVE',
    };

    mockRepo.updateStatus.mockResolvedValue(mockDiscount as any);

    const result = await service.deactivateDiscount(2);

    expect(mockRepo.updateStatus).toHaveBeenCalledWith(2, 'INACTIVE');
    expect(result).toEqual(mockDiscount);
  });

  it('should return null if discount not found when activating', async () => {
    mockRepo.updateStatus.mockResolvedValue(null);

    const result = await service.activateDiscount(999);

    expect(mockRepo.updateStatus).toHaveBeenCalledWith(999, 'ACTIVE');
    expect(result).toBeNull();
  });

  it('should return null if discount not found when deactivating', async () => {
    mockRepo.updateStatus.mockResolvedValue(null);

    const result = await service.deactivateDiscount(888);

    expect(mockRepo.updateStatus).toHaveBeenCalledWith(888, 'INACTIVE');
    expect(result).toBeNull();
  });

  it('should return original price and 0 discount if no active discount exists', async () => {
    const product = { id: 1, price: 100 } as any;

    mockRepo.findActiveDiscount.mockResolvedValue(null);

    const result = await service.getDiscountedPrice(product);

    expect(mockRepo.findActiveDiscount).toHaveBeenCalledWith(1);
    expect(result).toEqual({ discountAmount: 0, finalPrice: 100 });
  });

  it('should apply discount and return discounted price', async () => {
    const product = { id: 2, price: 200 } as any;

    const activeDiscount = {
      id: 10,
      productId: 2,
      value: 25, // 25%
      status: 'ACTIVE',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
    };

    mockRepo.findActiveDiscount.mockResolvedValue(activeDiscount as any);

    const result = await service.getDiscountedPrice(product);

    const expectedDiscount = (200 * 25) / 100;
    const expectedFinalPrice = 200 - expectedDiscount;

    expect(mockRepo.findActiveDiscount).toHaveBeenCalledWith(2);
    expect(result).toEqual({
      discountAmount: expectedDiscount,
      finalPrice: expectedFinalPrice,
    });
  });

  it('should get all discounts with productId, limit and offset', async () => {
    const mockData: any = {
      count: 2,
      rows: [
        { id: 1, productId: 1, value: 10 },
        { id: 2, productId: 1, value: 20 },
      ],
    };

    mockRepo.findAll.mockResolvedValue(mockData);

    const result = await service.getAllDiscounts(1, 10, 0);

    expect(mockRepo.findAll).toHaveBeenCalledWith(1, 10, 0);
    expect(result).toEqual(mockData);
  });

  it('should get all discounts without filters', async () => {
    const mockData: any = {
      count: 1,
      rows: [{ id: 3, productId: 2, value: 5 }],
    };

    mockRepo.findAll.mockResolvedValue(mockData);

    const result = await service.getAllDiscounts();

    expect(mockRepo.findAll).toHaveBeenCalledWith(undefined, undefined, undefined);
    expect(result).toEqual(mockData);
  });

  it('should create a discount when dates are already Date objects', async () => {
    const input: any = {
      productId: 5,
      value: 20,
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-12-31'),
      status: 'ACTIVE',
      type: 'PERCENTAGE',
    };

    const expectedDiscount = {
      id: 2,
      ...input,
    };

    mockRepo.create.mockResolvedValue(expectedDiscount as any);

    const result = await service.createDiscount(input);

    expect(mockRepo.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(expectedDiscount);
  });


});
