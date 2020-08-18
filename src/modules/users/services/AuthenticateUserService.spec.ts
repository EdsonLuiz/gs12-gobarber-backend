import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import CreateUserService from '@modules/users/services/CreateUserService';

const fakeUsersRepository = new FakeUsersRepository();
const fakeHashProvider = new FakeHashProvider();

const makeSut = (): AuthenticateUserService => {
  return new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
};

const makeCreateUser = (): CreateUserService => {
  return new CreateUserService(fakeUsersRepository, fakeHashProvider);
};

const fakeUserData = {
  email: 'valid@email.com',
  password: 'valid_password',
};

describe('AuthenticateUserService', () => {
  it('Should be able to authenticate', async () => {
    const createUserServiceInstance = makeCreateUser();
    const authenticateUser = makeSut();

    const createdUser = await createUserServiceInstance.execute({
      name: 'valid_name',
      ...fakeUserData,
    });

    const response = await authenticateUser.execute(fakeUserData);

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(createdUser);
  });
});
