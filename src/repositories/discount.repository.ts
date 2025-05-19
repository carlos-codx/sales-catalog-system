import { Discount, DiscountCreationAttributes } from '../models/discount.model';

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

}