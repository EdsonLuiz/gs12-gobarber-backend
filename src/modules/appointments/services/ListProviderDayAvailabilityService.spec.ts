import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import { ListProviderDayAvailabilityService } from './ListProviderDayAvailabilityService';

let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderDayAvailabilityService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });
  it('Should be able to list the hour availability from provider', async () => {
    for (let i = 8; i < 11; i++) {
      await fakeAppointmentsRepository.create({
        provider_id: 'some_id',
        date: new Date(2020, 4, 20, i, 0, 0),
      });
    }
    const availability = await listProviderDayAvailabilityService.execute({
      provider_id: 'some_id',
      day: 20,
      year: 2020,
      month: 5,
    });
    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: true },
      ]),
    );
  });
});
