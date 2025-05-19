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

  async getAllClients(nit?: string, limit?: number, offset?: number) {

    return await this.clientRepo.findAll(nit, limit, offset);

  }

  async updateClient(id: number, data: Partial<Client>) {
    return await this.clientRepo.update(id, data);
  }

  async deleteClient(id: number) {
    return await this.clientRepo.softDelete(id);
  }

  async getClientById(id: number) {
    return await this.clientRepo.findById(id);
  }

}