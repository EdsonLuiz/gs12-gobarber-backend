import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import { UpdateProfileService } from './UpdateProfileService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('Should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'new_valid_name',
      email: 'new_valid@mail.com',
    });

    expect(updatedUser.name).toBe('new_valid_name');
    expect(updatedUser.email).toBe('new_valid@mail.com');
  });

  it('Should not be able to update email if it already in use', async () => {
    await fakeUsersRepository.create({
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password',
    });

    const user = await fakeUsersRepository.create({
      name: 'another_valid_name',
      email: 'another_valid@mail.com',
      password: 'another_valid_password',
    });

    const promise = updateProfileService.execute({
      user_id: user.id,
      name: 'new_valid_name',
      email: 'valid@mail.com',
    });

    await expect(promise).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'new_valid_name',
      email: 'new_valid@mail.com',
      old_password: 'valid_password',
      password: 'new_password',
    });

    expect(updatedUser.name).toBe('new_valid_name');
    expect(updatedUser.email).toBe('new_valid@mail.com');
    expect(updatedUser.password).toBe('new_password');
  });

  it('Should not be able to update the password without passing the old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password',
    });

    const promise = updateProfileService.execute({
      user_id: user.id,
      name: 'new_valid_name',
      email: 'new_valid@mail.com',
      password: 'new_password',
    });

    await expect(promise).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to update the password if passing wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password',
    });

    const promise = updateProfileService.execute({
      user_id: user.id,
      name: 'new_valid_name',
      email: 'new_valid@mail.com',
      old_password: 'invalid_password',
      password: 'new_password',
    });

    await expect(promise).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able update the profile from non-existing user', async () => {
    const promise = updateProfileService.execute({
      user_id: 'non-existing-user-id',
      name: 'new_valid_name',
      email: 'new_valid@mail.com',
      old_password: 'invalid_password',
      password: 'new_password',
    });

    await expect(promise).rejects.toBeInstanceOf(AppError);
  });
});
