import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
    );
  });

  it('Should to reset the password', async () => {
    const createdUser = await fakeUsersRepository.create({
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'any_password',
    });

    const { token } = await fakeUserTokensRepository.generate(createdUser.id);

    await resetPasswordService.execute({ token, password: 'new_password' });

    const updatedUser = await fakeUsersRepository.findById(createdUser.id!);

    expect(updatedUser?.password).toBe('new_password');
  });
});
