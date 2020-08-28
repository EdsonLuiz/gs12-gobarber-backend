import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { startOfHour, isBefore, getHours } from 'date-fns';

import { injectable, inject } from 'tsyringe';
import IappointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import AppError from '@shared/errors/AppError';

interface Iresquest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private readonly appointmentsRepository: IappointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    user_id,
    date,
  }: Iresquest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);
    const dNow = new Date(Date.now());
    const nowIsBeforeAppointmentDate = isBefore(dNow, appointmentDate);
    const hasUserAndProviderSameId = user_id === provider_id;
    const isBefore8AM = getHours(appointmentDate) < 8;
    const isAfter5PM = getHours(appointmentDate) > 17;

    if (!nowIsBeforeAppointmentDate) {
      throw new AppError('You can not  create an appointment in a past date.');
    }

    if (hasUserAndProviderSameId) {
      throw new AppError('You can not  create an appointment with yourself.');
    }

    if (isBefore8AM || isAfter5PM) {
      throw new AppError('You can only create appointment between 8AM and 5PM');
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const createdAppointmeent = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    return createdAppointmeent;
  }
}

export default CreateAppointmentService;
