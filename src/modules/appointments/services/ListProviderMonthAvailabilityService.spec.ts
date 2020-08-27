import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import { ListProviderMonthAvailabilityService } from './ListProviderMonthAvailabilityService';

let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProvidersMonthAvailabilityService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });
  it('Should be able to list the month availability from provider', async () => {
    for (let i = 8; i < 18; i++) {
      await fakeAppointmentsRepository.create({
        provider_id: 'some_id',
        date: new Date(2020, 4, 20, i, 0, 0),
      });
    }
    const availability = await listProviderMonthAvailabilityService.execute({
      provider_id: 'some_id',
      year: 2020,
      month: 5,
    });
    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});
