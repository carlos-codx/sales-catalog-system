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
}