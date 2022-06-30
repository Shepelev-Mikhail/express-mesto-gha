const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ERROR_CODE_VALID, ERROR_CODE_NOT_FOUND, ERROR_CODE_DEFAULT } = require('../error');

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
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_VALID).send({ message: 'Переданы некорректные данные пользователя' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' });
    });
};

// найти всех пользователей
module.exports.findAllUser = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' }));
};

// найти пользователя по айди
module.exports.findByIdUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_VALID).send({ message: 'Передан некорректный id пользователя' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' });
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
        return res.status(ERROR_CODE_VALID).send({ message: 'Переданы некорректные данные пользователя' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' });
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
        return res.status(ERROR_CODE_VALID).send({ message: 'Переданы некорректные данные пользователя' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' });
    });
};

module.exports.showUserInfo = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' }));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

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
      res.status(401).send({ message: err.message });
    });
};
