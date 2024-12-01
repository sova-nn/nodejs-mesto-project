import * as http2 from "http2";

export const {
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_BAD_REQUEST
} = http2.constants

export const STATUS_CODES = {
  Error400: 400,
  Error409: 409,
  Error500: 500,
  Error11000: 11000
}

export const ERROR_MESSAGES = {
  ValidationError: 'Данные не прошли валидацию', //
  CastError: 'Невалидный id записи', //
  UserNotExists: 'Некорректный id или пользователь с данным id не найден', //
  PersonNotExists: 'Пользователь не найден!', //
  DocumentNotFoundError: 'В базе данных не найдена запись подходящая по параметрам запроса', //
  ServerError: 'На сервере произошла ошибка', //
  AuthRequired: 'Вход без регистрации запрещён!',
  AccessDenied: 'Неправильные почта или пароль', //
  DublicateItem: 'Попытка создания дублирующей записи!', //
  ResourceNotFound: 'Запрашиваемый ресурс не найден!' //
}