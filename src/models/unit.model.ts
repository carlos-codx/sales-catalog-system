import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../utils/database';

interface UnitAttributes {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UnitCreationAttributes extends Optional<UnitAttributes, 'id'> {}

export class Unit extends Model<UnitAttributes, UnitCreationAttributes> implements UnitAttributes {
  public id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Unit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'Unit',
    tableName: 'Units',
    timestamps: true,
  }
);