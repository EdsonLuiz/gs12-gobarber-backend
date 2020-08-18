import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;
    const createUserService = container.resolve(CreateUserService);

    const createdUser = await createUserService.execute({
      email,
      name,
      password,
    });

    delete createdUser.password;

    return response.json(createdUser);
  }
}
