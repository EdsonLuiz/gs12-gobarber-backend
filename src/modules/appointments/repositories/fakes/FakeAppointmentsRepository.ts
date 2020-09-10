import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { IcreateAppointmentDTO } from '@modules/appointments/dtos/IcreateAppointmentDTO';
import { isEqual, getYear, getMonth, getDate } from 'date-fns';
import { IFindAllInMonthFromProviderDTO } from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import { uuid } from 'uuidv4';
import { IFindAllInDayFromProviderDTO } from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

class FakeAppointentRepository implements IAppointmentsRepository {
  public async findAllInDayFromProvider(
    data: IFindAllInDayFromProviderDTO,
  ): Promise<Appointment[]> {
    const { provider_id, day, month, year } = data;

    const returnedAppointments = this.appointments.filter(
      appointment =>
        day === getDate(appointment.date) &&
        month === getMonth(appointment.date) + 1 &&
        appointment.provider_id === provider_id &&
        getYear(appointment.date) === year,
    );

    return returnedAppointments;
  }

  private appointments: Appointment[] = [];

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const returnedAppointments = this.appointments.filter(
      appointment =>
        month === getMonth(appointment.date) + 1 &&
        appointment.provider_id === provider_id &&
        getYear(appointment.date) === year,
    );

    return returnedAppointments;
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      appointment =>
        isEqual(appointment.date, date) &&
        appointment.provider_id === provider_id,
    );

    return findAppointment;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: IcreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, provider_id, user_id });

    this.appointments.push(appointment);

    return appointment;
  }
}

export default FakeAppointentRepository;
