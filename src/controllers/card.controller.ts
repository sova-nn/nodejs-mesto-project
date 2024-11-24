import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import Card from '../models/card/card';
import { SessionRequest } from '../middlewares/auth.middleware';

export const getCards = async (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.send({ data: cards }))
  .catch(next);

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const { owner } = req.body;
  return Card.create({ name, link, owner })
    .then((card) => {
      const { HTTP_STATUS_CREATED } = constants;
      res
        .status(HTTP_STATUS_CREATED)
        .send({ data: card });
    })
    .catch(next);
};

export const deleteCard = (req: SessionRequest, res: Response, next: NextFunction) => {
  // @ts-ignore
  const { id } = req.user;
  return Card.deleteOne({ _id: req.params.cardId, owner: id })
    .then((card) => {
      if (!card) next(new Error('Ошибка при удалении записи'));
      res.send({ data: 'Карточка успешно удалена' });
    })
    .catch(next);
};
export const addCardLike = (req: SessionRequest, res: Response, next: NextFunction) => {
  // @ts-ignore
  const { id: userId } = req.user;
  const { cardId } = req.params;
  return Card.updateOne({ _id: cardId }, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
};

export const dislike = (req: SessionRequest, res: Response, next: NextFunction) => {
  // @ts-ignore
  const { id: userId } = req.user;
  const { cardId } = req.params;
  return Card.updateOne({ _id: cardId }, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
};