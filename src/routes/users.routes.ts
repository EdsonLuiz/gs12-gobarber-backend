import { Router } from 'express';
import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const createUserService = new CreateUserService();

    const createdUser = await createUserService.execute({
      email,
      name,
      password,
    });

    return response.json(createdUser);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

export default usersRouter;
