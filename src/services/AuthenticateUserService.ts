import { getRepository } from 'typeorm';
import { hash, compare } from 'bcryptjs';

import User from '../models/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: { email },
    });

    if (!user) throw new Error('Incorrect email | password combination');

    // user.password = senha criptografada
    // password = senha nao criptografada

    const passwordIsMatched = await compare(password, user.password);

    if (!passwordIsMatched)
      throw new Error('Incorrect email | password combination');

    // Usuario autenticado
    delete user.password;

    return { user };
  }
}

export default AuthenticateUserService;
