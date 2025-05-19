import { Client } from '../models/client.model';
import { ClientRepository } from '../repositories/client.repository';
import { CreateClientInput } from '../utils/validators/client.validators';

export class ClientService {

  private readonly clientRepo: ClientRepository;

  constructor() {
    this.clientRepo = new ClientRepository();
  }

  async createClient(data: CreateClientInput): Promise<Client> {
    return await this.clientRepo.create(data);
  }

  async getClientByCode(code: string): Promise<Client | null> {

    return await this.clientRepo.findOne({ code });

  }

  async getClientByNit(nit: string): Promise<Client | null> {

    return await this.clientRepo.findOne({ nit });

  }

}