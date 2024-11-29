import { Request, NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface ISessionRequest extends Request {
  user?: {id: string} | JwtPayload;
}

export function checkAuthorization(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new Error('Вход без авторизации запрещён'));
  }
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new Error('Вход без авторизации запрещён'));
  }
  // @ts-ignore
  req.user = payload;
  return next();
}