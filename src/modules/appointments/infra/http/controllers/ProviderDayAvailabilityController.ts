import { container } from 'tsyringe';
import { Request, Response } from 'express';

import { ListProviderDayAvailabilityService } from '@modules/appointments/services/ListProviderDayAvailabilityService';

export class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { day, month, year } = request.body;
    const listProviderDayAvailabilityService = container.resolve(
      ListProviderDayAvailabilityService,
    );

    const availability = await listProviderDayAvailabilityService.execute({
      provider_id,
      day,
      month,
      year,
    });
    return response.json(availability);
  }
}
