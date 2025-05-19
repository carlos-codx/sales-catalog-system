import { Sale } from '../models/sale.model';
import { SaleRepository } from '../repositories/sale.repository';
import { DiscountService } from './discount.service';
import { ProductService } from './product.service';

export class SaleService {

  private readonly saleRepo: SaleRepository;
  private readonly discountService: DiscountService;
  private readonly productService: ProductService;

  constructor() {
    this.saleRepo = new SaleRepository();
    this.discountService = new DiscountService();
    this.productService = new ProductService();
  }

  async checkProductsExistence(
    productsIds: number[]
  ): Promise<boolean> {

    const productsDB = await this.productService.findManyByIds(productsIds);

    const allProductsExists = productsIds.every((productId) => {
      return productsDB.some((product) => product.id === productId);
    });

    return allProductsExists;

  }

  async registerSale(
    clientId: number | null,
    paymentMethod: string,
    products: { productId: number; quantity: number }[]
  ): Promise<{
    success: boolean;
    message?: string;
    sale?: Sale;
  }> {

    const details = [];
    let total = 0;

    const productsIds = products.map((item) => item.productId);
    const productsDB = await this.productService.findManyByIds(productsIds) ?? [];

    for (const item of products) {

      const product = productsDB?.find((p) => p.id === item.productId);

      if (!product) {
        return {
          success: false,
          message: 'No se encontraron todos los productos proporcionados',
        };
      }

      const { discountAmount, finalPrice } = await this.discountService.getDiscountedPrice(product);

      const subtotal = product.price * item.quantity;
      const totalLine = finalPrice * item.quantity;

      details.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        discount: discountAmount,
        subtotal,
        total: totalLine,
      });

      total += totalLine;

    }

    const sale = await this.saleRepo.createSaleWithDetails(
      {
        clientId,
        total,
        paymentMethod: paymentMethod,
      },
      details
    );

    if (!sale) {
      return {
        success: false,
        message: 'Error al registrar la venta',
      };
    }

    return {
      success: true,
      message: 'Venta registrada correctamente',
      sale,
    };

  }

}