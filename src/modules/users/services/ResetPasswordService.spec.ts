import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('Should be able to reset the password', async () => {
    const createdUser = await fakeUsersRepository.create({
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'any_password',
    });

    const { token } = await fakeUserTokensRepository.generate(createdUser.id);

    const generateHashSpy = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({ token, password: 'new_password' });

    const updatedUser = await fakeUsersRepository.findById(createdUser.id!);

    expect(updatedUser?.password).toBe('new_password');
    expect(generateHashSpy).toHaveBeenCalledWith('new_password');
  });

  it('Should not be able to reset password with non-existing token', async () => {
    const promise = resetPasswordService.execute({
      token: 'non-existing-token',
      password: 'valid_password',
    });
    await expect(promise).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to reset password with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existing-user',
    );
    const promise = resetPasswordService.execute({
      token,
      password: 'valid_password',
    });
    await expect(promise).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to reset password if passed more than 2 hours', async () => {
    const createdUser = await fakeUsersRepository.create({
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'any_password',
    });

    const { token } = await fakeUserTokensRepository.generate(createdUser.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    const promise = resetPasswordService.execute({
      token,
      password: 'new_password',
    });

    await expect(promise).rejects.toBeInstanceOf(AppError);
  });
});
