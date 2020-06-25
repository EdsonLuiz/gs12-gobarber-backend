import Appointment from '../models/Appointment';
import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentRepository from '../repositories/AppointmentsRepository';

interface Resquest {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ provider, date }: Resquest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const appointmentsRepository = getCustomRepository(AppointmentRepository);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw Error('This appointment is already booked');
    }

    const createdAppointmeent = appointmentsRepository.create({
      provider,
      date: appointmentDate,
    });

    await appointmentsRepository.save(createdAppointmeent);

    return createdAppointmeent;
  }
}

export default CreateAppointmentService;
