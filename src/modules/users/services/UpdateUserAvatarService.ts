import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import { IusersRepository } from '../repositories/IusersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface Request {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IusersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user)
      throw new AppError('Only authenticated users can change avatar.', 401);

    if (user.avatar) {
      await this.storageProvider.delete(user.avatar);
    }

    const fileName = await this.storageProvider.save(avatarFilename);

    user.avatar = fileName;

    await this.usersRepository.save(user);

    delete user.password;

    return user;
  }
}

export default UpdateUserAvatarService;
