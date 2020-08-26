import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import { IusersRepository } from '@modules/users/repositories/IusersRepository';

interface Request {
  user_id: string;
}

@injectable()
export class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IusersRepository,
  ) {}

  public async execute({ user_id }: Request): Promise<User[]> {
    const user = await this.usersRepository.findAllProviders({
      except_user_id: user_id,
    });
    return user;
  }
}
