import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate } from 'date-fns';

// import User from '@modules/users/infra/typeorm/entities/User';
import IappointmentsRepository from '../repositories/IAppointmentsRepository';

interface Request {
  provider_id: string;
  month: number;
  year: number;
}

export type AvailabilityResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
export class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IappointmentsRepository,
  ) {}

  private makeArrayOfDays(length: number): number[] {
    return Array.from({ length }, (_, index) => index + 1);
  }

  public async execute({
    provider_id,
    month,
    year,
  }: Request): Promise<AvailabilityResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        year,
        month,
      },
    );
    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));
    const eachDayArray = this.makeArrayOfDays(numberOfDaysInMonth);

    const availability = eachDayArray.map(day => {
      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });
      return {
        day,
        available: appointmentsInDay.length < 10,
      };
    });
    return availability;
  }
}
