import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ListProvidersService } from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;
let fakeCaheProvider: FakeCacheProvider;

describe('ListProvidersService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCaheProvider = new FakeCacheProvider();
    listProvidersService = new ListProvidersService(
      fakeUsersRepository,
      fakeCaheProvider,
    );
  });
  it('Should be able to list the provers', async () => {
    const userA = await fakeUsersRepository.create({
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password',
    });

    const userB = await fakeUsersRepository.create({
      name: 'valid_name2',
      email: 'valid2@mail.com',
      password: 'valid_password',
    });
    const activeUser = await fakeUsersRepository.create({
      name: 'valid_name3',
      email: 'valid3@mail.com',
      password: 'valid_password',
    });

    const providers = await listProvidersService.execute({
      user_id: activeUser.id,
    });

    expect(providers).toEqual([userA, userB]);
  });
});
