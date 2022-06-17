const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');
const { ERROR_CODE_NOT_FOUND } = require('./error');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62ab819167cafe22de0f3664',
  };

  next();
});

app.use('/', routerUser);
app.use('/', routerCard);

app.use((req, res, next) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Page not found' });
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
