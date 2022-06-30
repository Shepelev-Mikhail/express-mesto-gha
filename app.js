const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');
const auth = require('./middlewares/auth');
const { ERROR_CODE_NOT_FOUND } = require('./error');
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
app.post('/signin', login);
app.post('/signup', createUser);
app.use('/', auth, routerUser);
app.use('/', auth, routerCard);

// роут на несуществующую страницу
app.use((req, res, next) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Page not found' });
  next();
});

// подключение монгоДБ
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
