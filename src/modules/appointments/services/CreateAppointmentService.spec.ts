import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import { FakeNotificationsRepository } from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointmentService: CreateAppointmentService;
let appointmentData: { date: Date; user_id: string; provider_id: string };

describe('CreateAppointmentService', () => {
  beforeEach(() => {
    appointmentData = {
      date: new Date(2020, 4, 10, 14),
      user_id: 'valid_user_id',
      provider_id: 'valid_id',
    };
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
    );
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
  });

  it('Should be able to create new appointment with correct values', async () => {
    const createAppointmentServiceSpy = jest.spyOn(
      createAppointmentService,
      'execute',
    );

    await createAppointmentService.execute(appointmentData);

    expect(createAppointmentServiceSpy).toHaveBeenCalledWith(appointmentData);
  });

  it('Should be abble to create a new appointment', async () => {
    const appointment = await createAppointmentService.execute(appointmentData);

    expect(appointment).toHaveProperty('id');
  });

  it('Should not be abble to create two appointments at the same time', async () => {
    await createAppointmentService.execute(appointmentData);

    const promise = createAppointmentService.execute(appointmentData);

    await expect(promise).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create an appointment in a past date', async () => {
    appointmentData.date = new Date(2020, 4, 10, 11);
    const promise = createAppointmentService.execute(appointmentData);

    await expect(promise).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create an appointment with same user as provider', async () => {
    appointmentData.provider_id = 'same_id';
    appointmentData.user_id = 'same_id';
    const promise = createAppointmentService.execute(appointmentData);

    await expect(promise).rejects.toBeInstanceOf(AppError);
  });

  it('Should no be abble to create a new appointment before 8 AM', async () => {
    appointmentData.date = new Date(2020, 4, 12, 7);
    const promise = createAppointmentService.execute(appointmentData);

    await expect(promise).rejects.toBeInstanceOf(AppError);
  });

  it('Should no be abble to create a new appointment after 5 PM', async () => {
    appointmentData.date = new Date(2020, 4, 12, 18);
    const promise = createAppointmentService.execute(appointmentData);

    await expect(promise).rejects.toBeInstanceOf(AppError);
  });
});
