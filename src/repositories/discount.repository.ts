import { Discount, DiscountCreationAttributes } from '../models/discount.model';
import { Product } from '../models/product.model';

export class DiscountRepository {
  async create(data: DiscountCreationAttributes) {
    return await Discount.create(data);
  }

  async findOne(data: Partial<DiscountCreationAttributes>): Promise<Discount | null> {
    return await Discount.findOne({
      where: {
        ...data,
      },
    });
  }

  async updateStatus(id: number, status: 'ACTIVE' | 'INACTIVE'): Promise<Discount | null> {
    const discount = await Discount.findByPk(id);
    if (!discount) return null;

    discount.status = status;
    await discount.save();
    return discount;
  }

  async findAll(productId?: number, limit?: number, offset?: number): Promise<{ count: number; rows: Discount[] }> {

    const where: any = {};

    if (productId) {
      where.productId = productId;
    }

    return await Discount.findAndCountAll({
      where,
      include: [{ model: Product, as: 'product' }],
      limit,
      offset,
    });
  }

}