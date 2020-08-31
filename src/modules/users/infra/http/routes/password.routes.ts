import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import ForgotPasswordController from '@modules/users/infra/http/controllers/ForgotPasswordController';
import ResetPasswordController from '@modules/users/infra/http/controllers/ResetPasswordController';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

const forgotPasswordValidations = {
  [Segments.BODY]: {
    email: Joi.string().required(),
  },
};

const resetPasswordValidations = {
  [Segments.BODY]: {
    token: Joi.string().uuid().required(),
    password: Joi.string().required(),
    password_confirmation: Joi.string().required().valid(Joi.ref('password')),
  },
};

passwordRouter.post(
  '/forgot',
  celebrate(forgotPasswordValidations),
  forgotPasswordController.create,
);
passwordRouter.post(
  '/reset',
  celebrate(resetPasswordValidations),
  resetPasswordController.create,
);

export default passwordRouter;
