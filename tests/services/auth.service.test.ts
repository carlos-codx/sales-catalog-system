import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthService } from '../../src/services/auth.service';
import { UserRepository } from '../../src/repositories/user.repository';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../src/repositories/user.repository');

describe('AuthService', () => {
  let service: AuthService;
  let mockUserRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepo = new UserRepository() as jest.Mocked<UserRepository>;
    service = new AuthService();
    (service as any).userRepo = mockUserRepo;
    jest.clearAllMocks();
  });

  describe('validateEmail', () => {
    it('should return true if email exists', async () => {
      mockUserRepo.findByEmail.mockResolvedValue({ id: 1 } as any);
      const result = await service.validateEmail('test@example.com');
      expect(result).toBe(true);
    });

    it('should return false if email does not exist', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      const result = await service.validateEmail('test@example.com');
      expect(result).toBe(false);
    });
  });

  describe('hashPassword', () => {
    it('should return hashed password', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed123');
      const result = await service.hashPassword('plain');
      expect(result).toBe('hashed123');
      expect(bcrypt.hash).toHaveBeenCalledWith('plain', 10);
    });
  });

  describe('register', () => {
    it('should fail if email already exists', async () => {
      mockUserRepo.findByEmail.mockResolvedValue({ id: 1 } as any);

      const result = await service.register('taken@example.com', 'secret');

      expect(result).toEqual({
        status: 409,
        success: false,
        message: 'El correo electrónico no está disponible, intenta con otro',
      });
    });

    it('should register a new user if email is available', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_pw');
      const createdUser = { id: 123, email: 'new@example.com' };
      mockUserRepo.create.mockResolvedValue(createdUser as any);

      const result = await service.register('new@example.com', 'password');

      expect(mockUserRepo.create).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'hashed_pw',
      });

      expect(result).toEqual({
        status: 201,
        success: true,
        message: 'User registered successfully',
        result: createdUser,
      });
    });
  });

  describe('login', () => {
    it('should return null if user not found', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      const result = await service.login('missing@example.com', 'pass');
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      mockUserRepo.findByEmail.mockResolvedValue({ password: 'hashed' } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.login('test@example.com', 'wrong');
      expect(result).toBeNull();
    });

    it('should return null if JWT_SECRET is missing', async () => {
      mockUserRepo.findByEmail.mockResolvedValue({ id: 1, email: 'test@example.com', password: 'hashed' } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      delete process.env.JWT_SECRET;

      const result = await service.login('test@example.com', 'right');
      expect(result).toBeNull();
    });

    it('should return JWT token on valid login', async () => {
      process.env.JWT_SECRET = 'testsecret';

      const user = { id: 1, email: 'user@example.com', password: 'hashed' };
      mockUserRepo.findByEmail.mockResolvedValue(user as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('jwt_token');

      const result = await service.login('user@example.com', 'correct');

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: user.id, email: user.email },
        'testsecret',
        { expiresIn: '2h' }
      );

      expect(result).toBe('jwt_token');
    });
  });
});
