import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import { ShowProfileService } from './ShowProfileService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfileService = new ShowProfileService(fakeUsersRepository);
  });
  it('Should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password',
    });

    const profile = await showProfileService.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('valid_name');
    expect(profile.email).toBe('valid@mail.com');
  });

  it('Should not be able to show the profile from non-existing user', async () => {
    const promise = showProfileService.execute({
      user_id: 'non-existing-user-id',
    });

    await expect(promise).rejects.toBeInstanceOf(AppError);
  });
});
