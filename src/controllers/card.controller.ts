import { NextFunction, Request, Response } from 'express';
import { TEnhancedRequest } from '../types';
import Card from '../models/card/card';
import { STATUS_CODES } from 'http';
import {ERROR_MESSAGES} from "../middlewares/errors/config";

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => {
    res.send({ data: cards });
  })
  .catch((err) => {
    next();
  });

export const createCard = (req: TEnhancedRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user?._id;
  Card.create({ name, link, owner })
    .then((user) => res.send(user))
    .catch((err) => res.status(Number(STATUS_CODES.Error400)).send(err));
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => Card.findByIdAndDelete(req.params.cardId)
  .then((card) => {
    if (!card) {
      throw new Error(ERROR_MESSAGES.UserNotExists);
    }
    res.send({ data: card });
  })
  .catch(next);

export const addCardLike = (req: TEnhancedRequest, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true },
  ).then((card) => {
    res.send({ data: card });
  })
    .catch((err) => next(new Error(ERROR_MESSAGES.PersonNotExists)));
};

export const dislike = (req: TEnhancedRequest, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true },
  ).then((card) => {
    res.send({ data: card });
  })
    .catch((err) => next(new Error(ERROR_MESSAGES.PersonNotExists)));
};