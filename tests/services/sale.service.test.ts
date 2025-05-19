// 🔧 Mocks necesarios ANTES de importar servicios o modelos reales

jest.mock('../../src/models/unit.model', () => ({
  Unit: { init: jest.fn(), hasMany: jest.fn() },
}));

jest.mock('../../src/models/product.model', () => ({
  Product: { init: jest.fn(), belongsTo: jest.fn() },
}));

jest.mock('../../src/models/discount.model', () => ({
  Discount: { init: jest.fn(), belongsTo: jest.fn() },
}));

jest.mock('../../src/models/sale.model', () => ({
  Sale: { create: jest.fn() },
}));

jest.mock('../../src/models/sale-detail.model', () => ({
  SaleDetail: { bulkCreate: jest.fn() },
}));

const mockTransaction = {
  commit: jest.fn(),
  rollback: jest.fn(),
};

jest.mock('../../src/utils/database', () => ({
  sequelize: {
    transaction: jest.fn(() => Promise.resolve(mockTransaction)),
  },
}));

jest.mock('../../src/services/product.service');
jest.mock('../../src/services/discount.service');
jest.mock('../../src/repositories/sale.repository');

// 🔽 Ahora sí importamos los módulos reales

import { SaleService } from '../../src/services/sale.service';
import { ProductService } from '../../src/services/product.service';
import { DiscountService } from '../../src/services/discount.service';
import { SaleRepository } from '../../src/repositories/sale.repository';

describe('SaleService', () => {
  let service: SaleService;
  let mockProductService: jest.Mocked<ProductService>;
  let mockDiscountService: jest.Mocked<DiscountService>;
  let mockSaleRepo: jest.Mocked<SaleRepository>;

  beforeEach(() => {
    mockProductService = new ProductService() as jest.Mocked<ProductService>;
    mockDiscountService = new DiscountService() as jest.Mocked<DiscountService>;
    mockSaleRepo = new SaleRepository() as jest.Mocked<SaleRepository>;

    service = new SaleService();
    (service as any).productService = mockProductService;
    (service as any).discountService = mockDiscountService;
    (service as any).saleRepo = mockSaleRepo;

    jest.clearAllMocks();
  });

  it('should check if all products exist', async () => {
    const ids = [1, 2];
    mockProductService.findManyByIds.mockResolvedValue([{ id: 1 }, { id: 2 }] as any);

    const result = await service.checkProductsExistence(ids);

    expect(mockProductService.findManyByIds).toHaveBeenCalledWith(ids);
    expect(result).toBe(true);
  });

  it('should return false if not all product IDs exist', async () => {
    const ids = [1, 2];
    mockProductService.findManyByIds.mockResolvedValue([{ id: 1 }] as any);

    const result = await service.checkProductsExistence(ids);

    expect(result).toBe(false);
  });

  it('should return failure if a product is missing in productsDB', async () => {
    const productsInput = [
      { productId: 1, quantity: 1 },
      { productId: 2, quantity: 1 },
    ];

    mockProductService.findManyByIds.mockResolvedValue([{ id: 1, price: 100 }] as any);
    mockDiscountService.getDiscountedPrice.mockResolvedValue({ discountAmount: 0, finalPrice: 0 });

    const result = await service.registerSale(1, 'CASH', productsInput);

    expect(result).toEqual({
      success: false,
      message: 'No se encontraron todos los productos proporcionados',
    });
  });

  it('should register a sale successfully', async () => {
    const products = [{ productId: 1, quantity: 2 }];

    const mockProduct = { id: 1, price: 50 };
    const mockDiscount = { discountAmount: 5, finalPrice: 45 };
    const mockSale = { id: 101, clientId: 1, total: 90, paymentMethod: 'CASH' };

    mockProductService.findManyByIds.mockResolvedValue([mockProduct] as any);
    mockDiscountService.getDiscountedPrice.mockResolvedValue(mockDiscount);
    mockSaleRepo.createSaleWithDetails.mockResolvedValue(mockSale as any);

    const result = await service.registerSale(1, 'CASH', products);

    expect(mockProductService.findManyByIds).toHaveBeenCalledWith([1]);
    expect(mockDiscountService.getDiscountedPrice).toHaveBeenCalledWith(mockProduct);
    expect(mockSaleRepo.createSaleWithDetails).toHaveBeenCalledWith(
      {
        clientId: 1,
        total: 90,
        paymentMethod: 'CASH',
      },
      [
        {
          productId: 1,
          quantity: 2,
          unitPrice: 50,
          discount: 5,
          subtotal: 100,
          total: 90,
        },
      ]
    );

    expect(result).toEqual({
      success: true,
      message: 'Venta registrada correctamente',
      result: {
        sale: mockSale,
        summary: {
          subtotal: 100,
          discountTotal: 10, // 5 * 2
          total: 90,
        },
      },
    });
  });


  it('should return failure if sale creation fails', async () => {
    const products = [{ productId: 1, quantity: 1 }];
    const mockProduct = { id: 1, price: 100 };
    const mockDiscount = { discountAmount: 0, finalPrice: 100 };

    mockProductService.findManyByIds.mockResolvedValue([mockProduct] as any);
    mockDiscountService.getDiscountedPrice.mockResolvedValue(mockDiscount);
    mockSaleRepo.createSaleWithDetails.mockResolvedValue(null);

    const result = await service.registerSale(1, 'CASH', products);

    expect(result).toEqual({
      success: false,
      message: 'Error al registrar la venta',
    });
  });
});
