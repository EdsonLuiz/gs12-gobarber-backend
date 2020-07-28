import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { EntityRepository, Repository } from 'typeorm';
import { IappointmentsRepository } from '@modules/appointments/repositories/IAppointmentsRepository';

@EntityRepository(Appointment)
class AppointmentRepository extends Repository<Appointment>
  implements IappointmentsRepository {
  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.findOne({
      where: { date },
    });

    return findAppointment;
  }
}

export default AppointmentRepository;
