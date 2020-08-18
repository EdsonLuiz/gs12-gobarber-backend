import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { IcreateAppointmentDTO } from '@modules/appointments/dtos/IcreateAppointmentDTO';

export default interface IappointmentsRepository {
  create(data: IcreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
}
