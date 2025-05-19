import { ClientRepository } from '../../src/repositories/client.repository';
import { Client } from '../../src/models/client.model';

jest.mock('../../src/models/client.model');

describe('ClientRepository', () => {
  const repo = new ClientRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a client', async () => {
    const mockInput = {
      code: 'C001',
      fullName: 'Carlos Pérez',
      nit: '12345678',
      phone: '7654321',
      email: 'carlos@example.com',
    };

    const mockClient = {
      id: 1,
      ...mockInput,
    };

    (Client.create as jest.Mock).mockResolvedValue(mockClient);

    const result = await repo.create(mockInput);

    expect(Client.create).toHaveBeenCalledWith(mockInput);
    expect(result).toEqual(mockClient);
  });


  it('should find a client by a given field', async () => {
    const mockClient = {
      id: 1,
      code: 'C001',
      fullName: 'Carlos Pérez',
    };

    (Client.findOne as jest.Mock).mockResolvedValue(mockClient);

    const result = await repo.findOne({ code: 'C001' });

    expect(Client.findOne).toHaveBeenCalledWith({
      where: { code: 'C001' },
    });

    expect(result).toEqual(mockClient);
  });

  it('should return null if no client is found', async () => {
    (Client.findOne as jest.Mock).mockResolvedValue(null);

    const result = await repo.findOne({ nit: '00000000' });

    expect(Client.findOne).toHaveBeenCalledWith({
      where: { nit: '00000000' },
    });

    expect(result).toBeNull();
  });
  
});
