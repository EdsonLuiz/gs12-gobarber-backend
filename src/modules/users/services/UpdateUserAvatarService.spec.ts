import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';

interface SutTypes {
  sut: UpdateUserAvatarService;
  fakeUsersRepository: FakeUsersRepository;
  fakeStorageProvider: FakeStorageProvider;
}

const makeSut = (): SutTypes => {
  const fakeUsersRepository = new FakeUsersRepository();
  const fakeStorageProvider = new FakeStorageProvider();
  const sut = new UpdateUserAvatarService(
    fakeUsersRepository,
    fakeStorageProvider,
  );
  return { sut, fakeUsersRepository, fakeStorageProvider };
};

const fakeUserData = {
  name: 'valid_name',
  email: 'valid@email.com',
  password: 'valid_password',
};

describe('UpdateUserAvatar', () => {
  it('Should be able to update avatar', async () => {
    const { sut, fakeUsersRepository } = makeSut();

    const createdUser = await fakeUsersRepository.create(fakeUserData);

    const updatedUser = await sut.execute({
      user_id: createdUser.id,
      avatarFilename: 'valid_avatar.jpg',
    });

    expect(updatedUser.avatar).toBe('valid_avatar.jpg');
  });

  it('Should not be able to update avatar when invalid user is used', async () => {
    const { sut } = makeSut();

    const promise = sut.execute({
      user_id: 'non-existing-user-id',
      avatarFilename: 'valid_avatar.jpg',
    });

    expect(promise).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to delete avatar', async () => {
    const { sut, fakeUsersRepository, fakeStorageProvider } = makeSut();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'delete');
    const createdUser = await fakeUsersRepository.create(fakeUserData);

    await sut.execute({
      user_id: createdUser.id,
      avatarFilename: 'old_avatar.jpg',
    });

    const updatedUser = await sut.execute({
      user_id: createdUser.id,
      avatarFilename: 'new_avatar.jpg',
    });

    expect(deleteFile).toBeCalledWith('old_avatar.jpg');
    expect(updatedUser.avatar).toBe('new_avatar.jpg');
  });
});
