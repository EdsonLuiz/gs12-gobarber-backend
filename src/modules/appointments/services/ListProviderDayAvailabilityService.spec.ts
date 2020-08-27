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
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 7).getTime();
    });
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

  it('Should not be able to list the past hour availability from provider', async () => {
    for (let i = 14; i < 16; i++) {
      await fakeAppointmentsRepository.create({
        provider_id: 'some_id',
        date: new Date(2020, 4, 20, i, 0, 0),
      });
    }

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime();
    });
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
        { hour: 11, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
      ]),
    );
  });
});
