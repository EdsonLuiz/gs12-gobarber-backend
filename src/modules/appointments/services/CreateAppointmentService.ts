import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentRepository from '@modules/appointments/repositories/AppointmentsRepository';

import AppError from '@shared/errors/AppError';

interface Resquest {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ provider_id, date }: Resquest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const appointmentsRepository = getCustomRepository(AppointmentRepository);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const createdAppointmeent = await appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return createdAppointmeent;
  }
}

export default CreateAppointmentService;
