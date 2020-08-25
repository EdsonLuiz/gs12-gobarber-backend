import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { UpdateProfileService } from '@modules/users/services/UpdateProfileService';
import { ShowProfileService } from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const showProfileService = container.resolve(ShowProfileService);
    const user = await showProfileService.execute({ user_id });
    delete user.password;
    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, email, old_password, password } = request.body;
    const user_id = request.user.id;
    const updateProfileService = container.resolve(UpdateProfileService);

    const updatedUser = await updateProfileService.execute({
      user_id,
      email,
      name,
      old_password,
      password,
    });

    delete updatedUser.password;

    return response.json(updatedUser);
  }
}
