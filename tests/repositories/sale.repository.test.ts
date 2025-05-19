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

import { SaleRepository } from '../../src/repositories/sale.repository';
import { Sale } from '../../src/models/sale.model';
import { SaleDetail } from '../../src/models/sale-detail.model';
import { sequelize } from '../../src/utils/database';

describe('SaleRepository - createSaleWithDetails', () => {
  const repo = new SaleRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create sale and sale details in transaction', async () => {
    const saleData = {
      clientId: 1,
      total: 100,
      paymentMethod: 'CASH',
    };

    const detailData: any[] = [
      {
        productId: 1,
        quantity: 2,
        unitPrice: 25,
        discount: 0,
        subtotal: 50,
        total: 50,
      },
      {
        productId: 2,
        quantity: 1,
        unitPrice: 50,
        discount: 0,
        subtotal: 50,
        total: 50,
      },
    ];

    const mockSale = { id: 99, ...saleData };
    (Sale.create as jest.Mock).mockResolvedValue(mockSale);
    (SaleDetail.bulkCreate as jest.Mock).mockResolvedValue([]);

    const result = await repo.createSaleWithDetails(saleData, detailData);

    expect(sequelize.transaction).toHaveBeenCalled();
    expect(Sale.create).toHaveBeenCalledWith(saleData, { transaction: mockTransaction });

    const expectedDetails = detailData.map(d => ({ ...d, saleId: 99 }));
    expect(SaleDetail.bulkCreate).toHaveBeenCalledWith(expectedDetails, { transaction: mockTransaction });

    expect(mockTransaction.commit).toHaveBeenCalled();
    expect(result).toEqual(mockSale);
  });

  it('should rollback and return null if an error occurs', async () => {
    const saleData = { clientId: 1, total: 100, paymentMethod: 'CASH' };
    const detailData: any = [];

    (Sale.create as jest.Mock).mockRejectedValue(new Error('DB error'));

    const result = await repo.createSaleWithDetails(saleData, detailData);

    expect(sequelize.transaction).toHaveBeenCalled();
    expect(mockTransaction.rollback).toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
