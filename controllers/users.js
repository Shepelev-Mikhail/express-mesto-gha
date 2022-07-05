const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidError = require('../errors/ValidError');
const ConflictEmailError = require('../errors/ConflictEmailError');
const NotFoundError = require('../errors/NotFoundError');

const SECRET_KEY = 'practikum_secret_key';

// создание пользователя
module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!email || !password) {
    throw new ValidError('Не указан Email или пароль');
  }

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === 11000) {
        // const error = new Error('Email занят');
        // error.statusCode = 409;
        // throw error;
        throw new ConflictEmailError('Email занят');
      }
      if (err.name === 'ValidationError') {
        // return res.status(ERROR_CODE_VALID)
        //   .send({ message: 'Переданы некорректные данные пользователя' });
        throw new ValidError('Переданы некорректные данные пользователя');
      }
      // return res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' });
    });
};

// найти всех пользователей
module.exports.findAllUser = (req, res) => {
  User.find({})
    .then((users) => res.send(users));
  // .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' }));
};

// найти пользователя по айди
module.exports.findByIdUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        // return res.status(ERROR_CODE_NOT_FOUND)
        //   .send({ message: 'Пользователь с указанным id не найден' });
        throw new NotFoundError('Пользователь с указанным id не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // return res.status(ERROR_CODE_VALID)
        //   .send({ message: 'Передан некорректный id пользователя' });
        throw new ValidError('Передан некорректный id пользователя');
      }
      // return res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' });
    });
};

// обновление профиля
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // return res.status(ERROR_CODE_VALID)
        //   .send({ message: 'Переданы некорректные данные пользователя' });
        throw new ValidError('Переданы некорректные данные пользователя');
      }
      // return res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' });
    });
};

// обновление аватара
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // return res.status(ERROR_CODE_VALID)
        //   .send({ message: 'Переданы некорректные данные пользователя' });
        throw new ValidError('Переданы некорректные данные пользователя');
      }
      // return res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' });
    });
};

module.exports.showUserInfo = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.send(user));
  // .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' }));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ValidError('Не указан Email или пароль');
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        SECRET_KEY,
        { expiresIn: '7d' },
      );
      res.send({ token });
      // res.cookie('jwt', token, {
      //   httpOnly: true,
      // })
      //   .end();
    })
    .catch((err) => {
      res.send({ message: err.message });
    });
};
