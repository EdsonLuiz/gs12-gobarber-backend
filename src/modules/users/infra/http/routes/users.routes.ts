import { Router } from 'express';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import multer from 'multer';
import uploadConfig from '@config/upload';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const makeUsersRepository = new UsersRepository();
  const { name, email, password } = request.body;
  const createUserService = new CreateUserService(makeUsersRepository);

  const createdUser = await createUserService.execute({
    email,
    name,
    password,
  });

  delete createdUser.password;

  return response.json(createdUser);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const makeUsersRepository = new UsersRepository();
    const updateUserAvatar = new UpdateUserAvatarService(makeUsersRepository);
    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });
    return response.json(user);
  },
);

export default usersRouter;
