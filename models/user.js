const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const validator = require('validator');
const UnauthorizedError = require('../errors/UnauthorizedError');
// const { default: isEmail } = require('validator/lib/isEmail');
// const regex = /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/gi;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    // validate: {
    //   validator(password) {
    //     return regex.test(password);
    //   },
    //   message: 'Пароль некорректен'
    // }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // validate: {
    //   validator(email) {
    //     return validator.isEmail(email)
    //   },
    //   message: 'Емайл некорректен'
    // }
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
