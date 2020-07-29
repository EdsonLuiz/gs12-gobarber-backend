import { Router } from 'express';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;
  const makeUsersRepository = new UsersRepository();
  const authenticateUser = new AuthenticateUserService(makeUsersRepository);

  const { user, token } = await authenticateUser.execute({ email, password });

  return response.json({ user, token });
});

export default sessionsRouter;
