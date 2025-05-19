import { User, UserCreationAttributes } from '../models/user.model';

export class UserRepository {
  async create(data: UserCreationAttributes) {
    return await User.create(data);
  }

  async findByEmail(email: string) {
    return await User.findOne({ where: { email } });
  }
}