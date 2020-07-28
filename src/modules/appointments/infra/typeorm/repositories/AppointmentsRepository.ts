import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { getRepository, Repository } from 'typeorm';
import { IappointmentsRepository } from '@modules/appointments/repositories/IAppointmentsRepository';
import { IcreateAppointmentDTO } from '@modules/appointments/dtos/IcreateAppointmentDTO';

class AppointmentRepository implements IappointmentsRepository {
  private readonly ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date },
    });

    return findAppointment;
  }

  public async create({
    provider_id,
    date,
  }: IcreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ provider_id, date });

    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentRepository;
