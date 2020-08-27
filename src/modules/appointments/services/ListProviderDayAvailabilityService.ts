import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, getHours } from 'date-fns';

// import User from '@modules/users/infra/typeorm/entities/User';
import IappointmentsRepository from '../repositories/IAppointmentsRepository';

interface Request {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

export type AvailabilityResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
export class ListProviderDayAvailabilityService {
  private readonly hourStart = 8;

  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IappointmentsRepository,
  ) {}

  private makeArrayOfHours(length: number): number[] {
    return Array.from({ length }, (_, index) => index + this.hourStart);
  }

  public async execute({
    provider_id,
    month,
    year,
    day,
  }: Request): Promise<AvailabilityResponse> {
    const appointmentsOfDay = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        day,
        month,
        year,
      },
    );

    const eachHourArray = this.makeArrayOfHours(10);

    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointmentsOfDay.find(
        appointment => getHours(appointment.date) === hour,
      );
      return {
        hour,
        available: !hasAppointmentInHour,
      };
    });
    return availability;
  }
}
