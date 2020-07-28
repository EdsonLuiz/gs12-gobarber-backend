import Appointment from '../infra/typeorm/entities/Appointment';

export interface IappointmentsRepository {
  findByDate(date: Date): Promise<Appointment | undefined>;
}
