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


});
