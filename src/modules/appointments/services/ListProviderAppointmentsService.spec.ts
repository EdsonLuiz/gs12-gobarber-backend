import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ListProviderAppointmentsService } from './ListProviderAppointmentsService';

let listProviderAppointmentsService: ListProviderAppointmentsService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCaheProvider: FakeCacheProvider;

describe('ListProviderAppointmentsService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCaheProvider = new FakeCacheProvider();
    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCaheProvider,
    );
  });

  it('Should be able to list the appointments on a specific day', async () => {
    const createdAppointmeents: Appointment[] = [];
    for (let i = 8; i < 10; i++) {
      const tmp = await fakeAppointmentsRepository.create({
        provider_id: 'some_id',
        user_id: 'valid_user_id',
        date: new Date(2020, 4, 20, i, 0, 0),
      });
      createdAppointmeents.push(tmp);
    }

    const availability = await listProviderAppointmentsService.execute({
      provider_id: 'some_id',
      day: 20,
      year: 2020,
      month: 5,
    });

    expect(availability).toEqual(createdAppointmeents);
  });
});
