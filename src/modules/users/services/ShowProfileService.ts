import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import { IusersRepository } from '../repositories/IusersRepository';
import AppError from '@shared/errors/AppError';

interface Request {
  user_id: string;
}

@injectable()
export class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IusersRepository,
  ) {}

  public async execute({ user_id }: Request): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found');
    }
    return user;
  }
}
