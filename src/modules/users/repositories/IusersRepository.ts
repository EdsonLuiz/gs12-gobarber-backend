import User from '@modules/users/infra/typeorm/entities/User';
import { IcreateUserDTO } from 'modules/users/dtos/IcreateUserDTO';

export interface IusersRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: IcreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
