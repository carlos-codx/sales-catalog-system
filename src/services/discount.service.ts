import { Discount } from '../models/discount.model';
import { DiscountRepository } from '../repositories/discount.repository';
import { CreateDiscountInput } from '../utils/validators/discount.validators';

export class DiscountService {

  private readonly discountRepo: DiscountRepository;

  constructor() {
    this.discountRepo = new DiscountRepository();
  }

  async createDiscount(data: CreateDiscountInput): Promise<Discount | null> {
    return await this.discountRepo.create({
      ...data,
      startDate: typeof data.startDate === 'string' ? new Date(data.startDate) : data.startDate,
      endDate: typeof data.endDate === 'string' ? new Date(data.endDate) : data.endDate,
    });
  }

  async getDiscountByProductId(productId: number): Promise<Discount | null> {
    return await this.discountRepo.findOne({ productId });
  }

  async activateDiscount(id: number) {
    return await this.discountRepo.updateStatus(id, 'ACTIVE');
  }

  async deactivateDiscount(id: number) {
    return await this.discountRepo.updateStatus(id, 'INACTIVE');
  }

}