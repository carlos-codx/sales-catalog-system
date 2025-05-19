import { Op } from 'sequelize';
import { Client, ClientCreationAttributes } from '../models/client.model';

export class ClientRepository {
  async create(data: ClientCreationAttributes) {
    return await Client.create(data);
  }

  async findOne(data: Partial<ClientCreationAttributes>) {
    return await Client.findOne({
      where: {
        ...data,
      },
    });
  }

  async findAll(nit?: string, limit?: number, offset?: number): Promise<{ count: number; rows: Client[] }> {

    const where: any = {};

    if (nit) {
      where.nit = { [Op.like]: `%${nit}%` };
    }

    return await Client.findAndCountAll({
      where,
      limit,
      offset,
    });

  }

}