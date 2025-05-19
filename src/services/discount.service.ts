import { Discount } from '../models/discount.model';
import { Product } from '../models/product.model';
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

  async getAllDiscounts(productId?: number, limit?: number, offset?: number) {
    return await this.discountRepo.findAll(productId, limit, offset);
  }

  async getDiscountedPrice(product: Product): Promise<{ discountAmount: number; finalPrice: number }> {

    const discount = await this.discountRepo.findActiveDiscount(product.id);

    if (!discount) {
      return { discountAmount: 0, finalPrice: product.price };
    }

    const discountAmount = (product.price * discount.value) / 100;
    const finalPrice = product.price - discountAmount;

    return { discountAmount, finalPrice };

  }

}