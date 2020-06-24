import Appointment from '../models/Appointment';
import { startOfHour } from 'date-fns';
import AppointmentRepository from '../repositories/AppointmentsRepository';

interface Resquest {
  provider: string;
  date: Date;
}

class CreateAppointmentService {
  private appointmentsRepository: AppointmentRepository;

  constructor(appointmentsRepository: AppointmentRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public execute({ provider, date }: Resquest): Appointment {
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw Error('This appointment is already booked');
    }

    const createdAppointmeent = this.appointmentsRepository.create({
      provider,
      date: appointmentDate,
    });

    return createdAppointmeent;
  }
}

export default CreateAppointmentService;
