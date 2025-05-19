import { Product } from '../models/product.model';
import { CreateProductInput, UpdateProductInput } from '../utils/validators/product.validator';
import { ProductRepository } from '../repositories/product.repository';


export class ProductService {

  private readonly productRepo: ProductRepository;

  constructor() {
    this.productRepo = new ProductRepository();
  }

  async createProduct(data: CreateProductInput): Promise<Product> {
    const product = await this.productRepo.create(data);
    return product;
  }

  async getProductByName(name: string): Promise<Product | null> {
    const product = await this.productRepo.findOneByName(name);
    return product;
  }

  async getProductByCode(code: string): Promise<Product | null> {
    const product = await this.productRepo.findOneByCode(code);
    return product;
  }

  async getAllProducts(filters: { code?: string; name?: string }, limit?: number, offset?: number) {
    return await this.productRepo.findAll(filters, limit, offset);
  }

  async updateProduct(id: number, data: UpdateProductInput): Promise<Product | null> {
    return await this.productRepo.update(id, data);
  }

  async deleteProduct(id: number) {
    return await this.productRepo.softDelete(id);
  }

}