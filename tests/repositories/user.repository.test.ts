import { UserRepository } from '../../src/repositories/user.repository';
import { User } from '../../src/models/user.model';

jest.mock('../../src/models/user.model');

describe('UserRepository', () => {
  const repo = new UserRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
    };

    (User.create as jest.Mock).mockResolvedValue(mockUser);

    const result = await repo.create({
      email: 'test@example.com',
      password: 'hashedPassword',
    });

    expect(User.create).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'hashedPassword',
    });

    expect(result).toEqual(mockUser);
  });

  it('should find a user by email', async () => {
    const mockUser = {
      id: 2,
      email: 'user@example.com',
      password: 'secret',
    };

    (User.findOne as jest.Mock).mockResolvedValue(mockUser);

    const result = await repo.findByEmail('user@example.com');

    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: 'user@example.com' },
    });

    expect(result).toEqual(mockUser);
  });

  it('should return null if user not found by email', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    const result = await repo.findByEmail('nonexistent@example.com');

    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: 'nonexistent@example.com' },
    });

    expect(result).toBeNull();
  });
});
