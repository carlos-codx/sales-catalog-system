import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../utils/database';
import { Unit } from './unit.model';

interface ProductAttributes {
  id: number;
  code: string;
  name: string;
  description?: string;
  price: number;
  unitId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'description' | 'deletedAt'> {}

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public code!: string;
  public name!: string;
  public description?: string;
  public price!: number;
  public unitId!: number;
  public unit!: Unit;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    unitId: {
      type: DataTypes.NUMBER,
      allowNull: false,
      references: {
        model: Unit,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'Products',
    timestamps: true,
    paranoid: true,
  }
);

Product.belongsTo(Unit, { foreignKey: 'unitId', as: 'unit' });
Unit.hasMany(Product, { foreignKey: 'unitId', as: 'products' });