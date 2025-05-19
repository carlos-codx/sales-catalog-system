import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../utils/database';
import { Product } from './product.model';

interface DiscountAttributes {
  id: number;
  productId: number;
  type: 'PERCENTAGE';
  value: number;
  startDate: Date;
  endDate: Date;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface DiscountCreationAttributes extends Optional<DiscountAttributes, 'id' | 'deletedAt'> {}

export class Discount extends Model<DiscountAttributes, DiscountCreationAttributes> implements DiscountAttributes {
  public id!: number;
  public productId!: number;
  public type!: 'PERCENTAGE';
  public value!: number;
  public startDate!: Date;
  public endDate!: Date;
  public status!: 'ACTIVE' | 'INACTIVE';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Discount.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['PERCENTAGE']],
      },
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Discount',
    tableName: 'Discounts',
    timestamps: true,
    paranoid: true,
  }
);

Discount.belongsTo(Product, { foreignKey: 'productId', as: 'product' });