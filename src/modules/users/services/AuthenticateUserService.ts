import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';
import { IusersRepository } from '../repositories/IusersRepository';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IusersRepository,
  ) {}

  public async execute({ email, password }: Request): Promise<Response> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user)
      throw new AppError('Incorrect email | password combination', 401);

    // user.password = senha criptografada
    // password = senha nao criptografada

    const passwordIsMatched = await compare(password, user.password);

    if (!passwordIsMatched)
      throw new AppError('Incorrect email | password combination', 401);

    // Usuario autenticado
    delete user.password;

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
