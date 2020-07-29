import { hash } from 'bcryptjs';
import User from '@modules/users/infra/typeorm/entities/User';

import AppError from '@shared/errors/AppError';
import { IusersRepository } from '../repositories/IusersRepository';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  constructor(private usersRepository: IusersRepository) {}

  public async execute({ name, email, password }: Request): Promise<User> {
    const checkIfUserExists = await this.usersRepository.findByEmail(email);

    if (checkIfUserExists) throw new AppError('Email address already in use.');

    const hashedPassword = await hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    return user;
  }
}

export default CreateUserService;
