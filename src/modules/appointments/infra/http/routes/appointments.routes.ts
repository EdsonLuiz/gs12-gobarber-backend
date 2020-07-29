import { Router } from 'express';
import { parseISO } from 'date-fns';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

const appointmentsRouter = Router();

const makeCreateAppointmentService = (
  appointmentsRepositoryInstance: AppointmentsRepository,
): CreateAppointmentService => {
  return new CreateAppointmentService(appointmentsRepositoryInstance);
};

appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (request, response) => {

//   const appointments = await appointmentsRepository.find();
//   return response.json(appointments);
// });

appointmentsRouter.post('/', async (request, response) => {
  const appointmentsRepository = new AppointmentsRepository();
  const { provider_id, date } = request.body;

  const parsedDate = parseISO(date);
  const createAppointmentService = makeCreateAppointmentService(
    appointmentsRepository,
  );
  const createdAppointment = await createAppointmentService.execute({
    provider_id,
    date: parsedDate,
  });

  return response.json(createdAppointment);
});

export default appointmentsRouter;
