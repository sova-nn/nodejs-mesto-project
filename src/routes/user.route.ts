import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateAvatar,
  updateUser,
  getUserData,
} from '../controllers/user.controller';

const usersRouter = Router();

usersRouter.get('', getUsers);
usersRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), getUserById);
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(20).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
}), updateUser);
usersRouter.get('/me', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), getUserData);
usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
  }),
  // @ts-ignore
}), updateAvatar);

export default usersRouter;