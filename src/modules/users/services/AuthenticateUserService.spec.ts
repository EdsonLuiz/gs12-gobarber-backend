import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import CreateUserService from '@modules/users/services/CreateUserService';
import AppError from '@shared/errors/AppError';

interface SutTypes {
  sut: AuthenticateUserService;
  makeCreateUser: CreateUserService;
}

const makeSut = (): SutTypes => {
  const fakeUsersRepository = new FakeUsersRepository();
  const fakeHashProvider = new FakeHashProvider();
  const sut = new AuthenticateUserService(
    fakeUsersRepository,
    fakeHashProvider,
  );
  const makeCreateUser = new CreateUserService(
    fakeUsersRepository,
    fakeHashProvider,
  );
  return { sut, makeCreateUser };
};

const fakeUserData = {
  email: 'valid@email.com',
  password: 'valid_password',
};

describe('AuthenticateUserService', () => {
  it('Should be able to authenticate', async () => {
    const { makeCreateUser, sut } = makeSut();

    const createdUser = await makeCreateUser.execute({
      name: 'valid_name',
      ...fakeUserData,
    });

    const response = await sut.execute(fakeUserData);

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(createdUser);
  });

  it('Should not be abble to authenticate with non existing user', async () => {
    const { sut } = makeSut();

    const promise = sut.execute(fakeUserData);

    await expect(promise).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to authenticate with incorrect password', async () => {
    const { makeCreateUser, sut } = makeSut();

    await makeCreateUser.execute({
      name: 'valid_name',
      email: 'valid@email.com',
      password: 'valid_password',
    });

    const promise = sut.execute({
      email: 'valid@email.com',
      password: 'invalid_password',
    });

    expect(promise).rejects.toBeInstanceOf(AppError);
  });
});
