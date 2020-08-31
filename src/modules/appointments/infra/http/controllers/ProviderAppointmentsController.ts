import { container } from 'tsyringe';
import { Request, Response } from 'express';

import { ListProviderAppointmentsService } from '@modules/appointments/services/ListProviderAppointmentsService';

export default class AppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { day, month, year } = request.body;

    const listProviderAppointmentsService = container.resolve(
      ListProviderAppointmentsService,
    );

    const createdAppointment = await listProviderAppointmentsService.execute({
      provider_id,
      day,
      month,
      year,
    });

    return response.json(createdAppointment);
  }
}
