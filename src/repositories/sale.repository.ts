import { sequelize } from '../utils/database';
import { Sale, SaleCreationAttributes } from '../models/sale.model';
import { SaleDetail, SaleDetailCreationAttributes } from '../models/sale-detail.model';

export class SaleRepository {
  async createSaleWithDetails(
    saleData: SaleCreationAttributes,
    detailData: SaleDetailCreationAttributes[]
  ): Promise<Sale | null> {

    const transaction = await sequelize.transaction();

    try {

      const sale = await Sale.create(saleData, { transaction });

      const saleDetails = detailData.map((detail) => ({
        ...detail,
        saleId: sale.id,
      }));

      await SaleDetail.bulkCreate(saleDetails, { transaction });
      await transaction.commit();

      return sale;

    } catch (error) {
      console.error('Error creating sale with details:', error);
      await transaction.rollback();
      return null;
    }

  }

  async deleteById(id: number): Promise<void> {
    const sale = await Sale.findByPk(id);
    if (!sale) return;

    await sale.destroy();
  }

}