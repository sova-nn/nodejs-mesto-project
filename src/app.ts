import express from 'express';
require('dotenv').config();
import mongoose from 'mongoose';
import usersRouter from "./routes/user.route";
import {TControllerParameters} from "./types";
import cardsRouter from "./routes/card.route";
import {ISessionRequest} from "./middlewares/auth.middleware";

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const db = mongoose.connection;
db.on("error", (err) => {
  console.log("error", err);
});
db.once("open", () => {
  console.log("DB connection Successful!");
});

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;


const app = express();

app.use((...[req, _, next]: TControllerParameters) => {
  req.user = {
    _id: '6748b21758b2d17db8aa1ca6'
  };
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('*', (req, res) => {
  res.status(404).send({message: 'Запрашиваемый ресурс не найден'});
});


app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
})