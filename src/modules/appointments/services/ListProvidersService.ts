import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import { IusersRepository } from '@modules/users/repositories/IusersRepository';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface Request {
  user_id: string;
}

@injectable()
export class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IusersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id }: Request): Promise<User[]> {
    let users = await this.cacheProvider.recover<User[]>(
      `providers-list:${user_id}`,
    );

    if (!users) {
      users = await this.usersRepository.findAllProviders({
        except_user_id: user_id,
      });
      console.log('Query no banco');
    }

    await this.cacheProvider.save(`providers-list:${user_id}`, users);

    return users;
  }
}
