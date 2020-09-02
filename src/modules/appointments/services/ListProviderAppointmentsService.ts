import { injectable, inject } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IappointmentsRepository from '../repositories/IAppointmentsRepository';

interface Request {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
export class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IappointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: Request): Promise<Appointment[]> {
    const cacheData = await this.cacheProvider.recover('this');
    console.log(cacheData);

    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        day,
        month,
        year,
      },
    );

    // await this.cacheProvider.save('this', 'ok');

    return appointments;
  }
}
