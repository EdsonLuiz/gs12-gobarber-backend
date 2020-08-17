import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { IappointmentsRepository } from '@modules/appointments/repositories/IAppointmentsRepository';
import { IcreateAppointmentDTO } from '@modules/appointments/dtos/IcreateAppointmentDTO';
import {isEqual} from 'date-fns'

class AppointmentRepository implements IappointmentsRepository {

  private appointments: Appointment[] = [] 

  public async findByDate(date: Date): Promise<Appointment | undefined> {

    const findAppointment = this.appointments.find(appointment => isEqual(appointment.date, date) )

    return findAppointment
  }

  public async create({
    provider_id,
    date,
  }: IcreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment()

    Object.assign(appointment, {id: 'fake_id', date, provider_id})

    this.appointments.push(appointment)

    return appointment
  }
}

export default AppointmentRepository;
