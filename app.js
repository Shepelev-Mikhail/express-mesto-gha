const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');
const auth = require('./middlewares/auth');
const {
  createUser,
  login,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

// прием данных
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// подключение роутов
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/),
  }),
}), createUser);
app.use('/', auth, routerUser);
app.use('/', auth, routerCard);

// роут на несуществующую страницу
app.use((req, res, next) => {
  res.status(404).send({ message: 'Page not found' });
  next();
});

// подключение монгоДБ
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

// обработка ошибок селебрейта
app.use(errors());

// обработка ошибок
app.use((err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  console.error(err.stack);
  return res.status(500).send({ message: 'Произошла ошибка' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
