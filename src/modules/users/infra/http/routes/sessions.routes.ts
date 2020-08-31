import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import SessionsController from '@modules/users/infra/http/controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

const sessionsCreateValidations = {
  [Segments.BODY]: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
};

sessionsRouter.post(
  '/',
  celebrate(sessionsCreateValidations),
  sessionsController.create,
);

export default sessionsRouter;
