import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../utils/database';
import { Client } from './client.model';

interface SaleAttributes {
  id: number;
  clientId?: number | null;
  total: number;
  paymentMethod: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

interface SaleCreationAttributes extends Optional<SaleAttributes, 'id' | 'deletedAt'> {}

export class Sale extends Model<SaleAttributes, SaleCreationAttributes> implements SaleAttributes {
  public id!: number;
  public clientId!: number | null;
  public total!: number;
  public paymentMethod!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Sale.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'CASH',
    },
  },
  {
    sequelize,
    modelName: 'Sale',
    tableName: 'Sales',
    timestamps: true,
    paranoid: true,
  }
);

Sale.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });