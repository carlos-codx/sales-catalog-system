import { ClientService } from '../../src/services/client.service';
import { ClientRepository } from '../../src/repositories/client.repository';
import { CreateClientInput } from '../../src/utils/validators/client.validators';

jest.mock('../../src/repositories/client.repository');

describe('ClientService', () => {
  const MockedRepo = ClientRepository as jest.MockedClass<typeof ClientRepository>;
  let service: ClientService;
  let mockRepo: jest.Mocked<ClientRepository>;

  beforeEach(() => {
    mockRepo = new MockedRepo() as jest.Mocked<ClientRepository>;
    service = new ClientService();
    (service as any).clientRepo = mockRepo;
  });

  it('should create a client with valid sanitized input', async () => {
    const input: CreateClientInput = {
      code: 'C001',
      fullName: 'Carlos Pérez',
      nit: '12345678',
      phone: '7654321',
      email: 'carlos@example.com',
    };

    const createdClient = { id: 1, ...input };

    mockRepo.create.mockResolvedValue(createdClient as any);

    const result = await service.createClient(input);

    expect(mockRepo.create).toHaveBeenCalledWith(input);
    expect(result).toEqual(createdClient);
  });

  it('should get a client by code', async () => {
    const mockClient = {
      id: 1,
      code: 'C001',
      fullName: 'Carlos Pérez',
      nit: '12345678',
      phone: '7654321',
      email: 'carlos@example.com',
    };

    mockRepo.findOne.mockResolvedValue(mockClient as any);

    const result = await service.getClientByCode('C001');

    expect(mockRepo.findOne).toHaveBeenCalledWith({ code: 'C001' });
    expect(result).toEqual(mockClient);
  });

  it('should get a client by nit', async () => {
    const mockClient = {
      id: 2,
      code: 'C002',
      fullName: 'Ana López',
      nit: '987654321',
      phone: '11223344',
      email: 'ana@example.com',
    };

    mockRepo.findOne.mockResolvedValue(mockClient as any);

    const result = await service.getClientByNit('987654321');

    expect(mockRepo.findOne).toHaveBeenCalledWith({ nit: '987654321' });
    expect(result).toEqual(mockClient);
  });

  it('should get all clients with nit filter and pagination', async () => {
    const mockData: any = {
      count: 2,
      rows: [
        { id: 1, fullName: 'Carlos', nit: '1234', createdAt: new Date(), updatedAt: new Date() },
        { id: 2, fullName: 'Ana', nit: '1234', createdAt: new Date(), updatedAt: new Date() },
      ],
    };

    mockRepo.findAll.mockResolvedValue(mockData);

    const result = await service.getAllClients('1234', 10, 0);

    expect(mockRepo.findAll).toHaveBeenCalledWith('1234', 10, 0);
    expect(result).toEqual(mockData);
  });

  it('should get all clients without filters', async () => {
    const mockData: any = {
      count: 1,
      rows: [{ id: 1, fullName: 'Lucía', nit: '999999', createdAt: new Date(), updatedAt: new Date() }],
    };

    mockRepo.findAll.mockResolvedValue(mockData);

    const result = await service.getAllClients();

    expect(mockRepo.findAll).toHaveBeenCalledWith(undefined, undefined, undefined);
    expect(result).toEqual(mockData);
  });

});
