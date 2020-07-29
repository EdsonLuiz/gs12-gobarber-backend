import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { startOfHour } from 'date-fns';
import { IappointmentsRepository } from '@modules/appointments/repositories/IAppointmentsRepository';

import AppError from '@shared/errors/AppError';

interface Iresquest {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  constructor(
    private readonly appointmentsRepository: IappointmentsRepository,
  ) {}

  public async execute({ provider_id, date }: Iresquest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const createdAppointmeent = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return createdAppointmeent;
  }
}

export default CreateAppointmentService;
