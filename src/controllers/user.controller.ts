import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { constants } from 'http2';
import jwt from 'jsonwebtoken';
import { ISessionRequest } from '../middlewares/auth.middleware';
import User from '../models/user/user';

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

// eslint-disable-next-line max-len
export const getUserById = (req: Request, res: Response, next: NextFunction) => User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    res.send({ data: user });
  })
  .catch(next);

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  const hash = await bcrypt.hash(password, 10);
  return User.create({
    email,
    password: hash,
    name,
    about,
    avatar,
  })
    .then((user) => {
      const { HTTP_STATUS_CREATED } = constants;
      res
        .status(HTTP_STATUS_CREATED)
        .send({ data: user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new Error('Такая запись уже есть'));
      } return next(err);
    });
};

export const getUserData = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  return User.findOne({ _id: userId })
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password).then((user: any) => {
    const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '1d' });
    res
      .send({
        token,
      });
  })
    .catch(next);
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name,
    about,
  } = req.body;
  return User.findOneAndUpdate(
    { _id: req.body.user._id },
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch(next);
};

export const updateAvatar = (req: ISessionRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  // @ts-ignore
  const { id: userId } = req.user;
  return User.findOneAndUpdate(
    { _id: userId },
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};