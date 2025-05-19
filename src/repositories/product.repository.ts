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

  async update(id: number, data: Partial<Product>): Promise<Product | null> {
    const product = await Product.findByPk(id);
    if (!product) return null;

    await product.update(data);
    return product;
  }

  async softDelete(id: number): Promise<boolean> {
    const product = await Product.findByPk(id);
    if (!product) return false;

    await product.destroy();
    return true;
  }

  async findById(id: number): Promise<Product | null> {
    const product = await Product.findOne({
      where: { id },
      include: [{ model: Unit, as: 'unit' }],
    });

    if (!product) {
      return null;
    }

    return product;
  }

  async findManyByIds(ids: number[]): Promise<Product[]> {
    return await Product.findAll({
      where: { id: { [Op.in]: ids } },
      include: [{ model: Unit, as: 'unit' }],
    });
  }

}