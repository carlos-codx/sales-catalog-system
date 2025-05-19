import { Product, ProductCreationAttributes } from '../models/product.model';

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

}