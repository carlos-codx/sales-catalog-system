import { Op } from 'sequelize';
import { Product, ProductCreationAttributes } from '../models/product.model';
import { Unit } from '../models/unit.model';

export class ProductRepository {
  async create(data: ProductCreationAttributes) {
    return await Product.create(data);
  }

  async findOneByName(name: string) {
    return await Product.findOne({ where: { name } });
  }

  async findOneByCode(code: string) {
    return await Product.findOne({ where: { code } });
  }

  async findAll(filters: { code?: string; name?: string }, limit?: number, offset?: number) {
    const where: any = {};

    if (filters.code) {
      where.code = { [Op.like]: `%${filters.code}%` };
    }
    if (filters.name) {
      where.name = { [Op.like]: `%${filters.name}%` };
    }

    return await Product.findAndCountAll({
      where,
      include: [{ model: Unit, as: 'unit' }],
      limit,
      offset,
    });
  }

}