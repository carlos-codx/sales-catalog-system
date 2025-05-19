import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import jwt from 'jsonwebtoken';

export class AuthService {

  private readonly userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async validateEmail(email: string) {

    const exists = await this.userRepo.findByEmail(email);
    return !!exists;

  }

  async hashPassword(password: string) {
    const hashed = await bcrypt.hash(password, 10);
    return hashed;
  }

  async register(email: string, password: string) {

    const exists = await this.userRepo.findByEmail(email);

    if (exists) {
      return {
        status: 409,
        success: false,
        message: 'El correo electrónico no está disponible, intenta con otro',
      };
    }

    const hashedPassword = await this.hashPassword(password);

    const user = await this.userRepo.create({
      email,
      password: hashedPassword,
    });

    return {
      status: 201,
      success: true,
      message: 'User registered successfully',
      result: user,
    };

  }

  async login(email: string, password: string): Promise<string | null> {

    const user = await this.userRepo.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const secret  = process.env.JWT_SECRET ?? null;

    if (!secret) {
      return null;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      secret,
      { expiresIn: '2h' }
    );

    return token;

  }

}