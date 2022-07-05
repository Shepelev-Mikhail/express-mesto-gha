const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const {
  findAllUser,
  findByIdUser,
  updateProfile,
  updateAvatar,
  showUserInfo,
} = require('../controllers/users');

router.get('/users', findAllUser);

router.get('/users/me', showUserInfo);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).required(),
  }),
}), findByIdUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])/),
  }),
}), updateAvatar);

module.exports = router;
