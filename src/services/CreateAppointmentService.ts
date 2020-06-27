import Appointment from '../models/Appointment';
import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentRepository from '../repositories/AppointmentsRepository';

import AppError from '../errors/AppError';

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

    const createdAppointmeent = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(createdAppointmeent);

    return createdAppointmeent;
  }
}

export default CreateAppointmentService;
