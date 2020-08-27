import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { IcreateAppointmentDTO } from '@modules/appointments/dtos/IcreateAppointmentDTO';
import { IFindAllInMonthFromProviderDTO } from '../dtos/IFindAllInMonthFromProviderDTO';
import { IFindAllInDayFromProviderDTO } from '../dtos/IFindAllInDayFromProviderDTO';

export default interface IappointmentsRepository {
  create(data: IcreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO,
  ): Promise<Appointment[]>;
  findAllInDayFromProvider(
    data: IFindAllInDayFromProviderDTO,
  ): Promise<Appointment[]>;
}
