import { ClientRepository } from '../../src/repositories/client.repository';
import { Client } from '../../src/models/client.model';
import { Op } from 'sequelize';

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

 it('should find all clients with nit filter and pagination', async () => {
    const mockResult = {
      count: 2,
      rows: [
        { id: 1, nit: '12345678' },
        { id: 2, nit: '12349876' },
      ],
    };

    (Client.findAndCountAll as jest.Mock).mockResolvedValue(mockResult);

    const result = await repo.findAll('1234', 10, 0);

    expect(Client.findAndCountAll).toHaveBeenCalledWith({
      where: { nit: { [Op.like]: '%1234%' } },
      limit: 10,
      offset: 0,
    });

    expect(result).toEqual(mockResult);
  });

  it('should find all clients without filters', async () => {
    const mockResult = {
      count: 1,
      rows: [{ id: 1, nit: '99999999' }],
    };

    (Client.findAndCountAll as jest.Mock).mockResolvedValue(mockResult);

    const result = await repo.findAll();

    expect(Client.findAndCountAll).toHaveBeenCalledWith({
      where: {},
      limit: undefined,
      offset: undefined,
    });

    expect(result).toEqual(mockResult);
  });

  it('should update a client if found', async () => {
    const mockClient = {
      id: 1,
      fullName: 'Carlos',
      update: jest.fn().mockResolvedValue(undefined),
    };

    (Client.findByPk as jest.Mock).mockResolvedValue(mockClient);

    const updatedData = { fullName: 'Carlos Actualizado' };
    const result = await repo.update(1, updatedData);

    expect(Client.findByPk).toHaveBeenCalledWith(1);
    expect(mockClient.update).toHaveBeenCalledWith(updatedData);
    expect(result).toBe(mockClient);
  });

  it('should return null if client to update is not found', async () => {
    (Client.findByPk as jest.Mock).mockResolvedValue(null);

    const result = await repo.update(999, { fullName: 'No existe' });

    expect(Client.findByPk).toHaveBeenCalledWith(999);
    expect(result).toBeNull();
  });

  it('should soft delete a client if found', async () => {
    const mockClient = {
      id: 2,
      destroy: jest.fn().mockResolvedValue(undefined),
    };

    (Client.findByPk as jest.Mock).mockResolvedValue(mockClient);

    const result = await repo.softDelete(2);

    expect(Client.findByPk).toHaveBeenCalledWith(2);
    expect(mockClient.destroy).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should return false if client to delete is not found', async () => {
    (Client.findByPk as jest.Mock).mockResolvedValue(null);

    const result = await repo.softDelete(999);

    expect(Client.findByPk).toHaveBeenCalledWith(999);
    expect(result).toBe(false);
  });

  it('should find a client by id', async () => {
    const mockClient = {
      id: 1,
      fullName: 'Carlos Pérez',
      nit: '12345678',
    };

    (Client.findOne as jest.Mock).mockResolvedValue(mockClient);

    const result = await repo.findById(1);

    expect(Client.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(mockClient);
  });

  it('should return null if client not found by id', async () => {
    (Client.findOne as jest.Mock).mockResolvedValue(null);

    const result = await repo.findById(999);

    expect(Client.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    expect(result).toBeNull();
  });

  
});
