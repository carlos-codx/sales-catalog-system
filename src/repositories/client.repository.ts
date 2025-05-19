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

  async update(id: number, data: Partial<Client>): Promise<Client | null> {

    const client = await Client.findByPk(id);

    if (!client) return null;

    await client.update(data);
    return client;
  }

  async softDelete(id: number): Promise<boolean> {

    const client = await Client.findByPk(id);
    if (!client) return false;

    await client.destroy();
    return true;
  }

}