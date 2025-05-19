import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../utils/database';

interface ClientAttributes {
  id: number;
  code: string;
  fullName: string;
  nit: string;
  phone: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface ClientCreationAttributes extends Optional<ClientAttributes, 'id' | 'email' | 'deletedAt'> {}

export class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  public id!: number;
  public code!: string;
  public fullName!: string;
  public nit!: string;
  public phone!: string;
  public email?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Client',
    tableName: 'Clients',
    timestamps: true,
    paranoid: true,
  }
);