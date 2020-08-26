import { uuid } from 'uuidv4';
import User from '@modules/users/infra/typeorm/entities/User';
import { IusersRepository } from '@modules/users/repositories/IusersRepository';
import { IcreateUserDTO } from '@modules/users/dtos/IcreateUserDTO';
import { IFindAllProvidersDTO } from '@modules/users/dtos/IFindAllProvidersDTO';

class UsersRepository implements IusersRepository {
  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let { users } = this;
    if (except_user_id) {
      users = this.users.filter(user => user.id !== except_user_id);
    }
    return users;
  }

  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const returnedUser = this.users.find(user => user.id === id);

    return returnedUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const returnedUser = this.users.find(user => user.email === email);

    return returnedUser;
  }

  public async create(userData: IcreateUserDTO): Promise<User> {
    const newUser = new User();
    Object.assign(newUser, { id: uuid() }, userData);
    this.users.push(newUser);

    return newUser;
  }

  public async save(user: User): Promise<User> {
    const userIndex = this.users.findIndex(
      userInMemory => userInMemory.id === user.id,
    );

    this.users[userIndex] = user;

    return user;
  }
}

export default UsersRepository;
