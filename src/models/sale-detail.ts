import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../utils/database';
import { Product } from './product.model';
import { Sale } from './sale.model';

interface SaleDetailAttributes {
  id: number;
  saleId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

interface SaleDetailCreationAttributes extends Optional<SaleDetailAttributes, 'id' | 'deletedAt'> {}

export class SaleDetail extends Model<SaleDetailAttributes, SaleDetailCreationAttributes> implements SaleDetailAttributes {
  public id!: number;
  public saleId!: number;
  public productId!: number;
  public quantity!: number;
  public unitPrice!: number;
  public discount!: number;
  public subtotal!: number;
  public total!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

SaleDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    saleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'SaleDetail',
    tableName: 'SaleDetails',
    timestamps: true,
    paranoid: true,
  }
);

SaleDetail.belongsTo(Sale, { foreignKey: 'saleId' });
SaleDetail.belongsTo(Product, { foreignKey: 'productId' });