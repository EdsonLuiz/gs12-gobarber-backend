import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import ProfileController from '@modules/users/infra/http/controllers/ProfileController';

const profileRouter = Router();
const profileController = new ProfileController();

const profileUpdateValidations = {
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    old_password: Joi.string(),
    password: Joi.string(),
    password_confirmation: Joi.string().valid(Joi.ref('password')),
  },
};

profileRouter.use(ensureAuthenticated);

profileRouter.put(
  '/',
  celebrate(profileUpdateValidations),
  profileController.update,
);
profileRouter.get('/', profileController.show);

export default profileRouter;
