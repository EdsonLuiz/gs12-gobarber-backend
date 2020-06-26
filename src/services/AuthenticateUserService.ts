import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../models/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
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

    const token = sign({}, '72bdd35aae7e5ebb1f61d086e4df8e30', {
      subject: user.id,
      expiresIn: '1d',
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
