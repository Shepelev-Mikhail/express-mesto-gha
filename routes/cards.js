const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const {
  createCard,
  findAllCard,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/cards', findAllCard);
router.post('/cards', celebrate({
  params: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2),
  }),
}), createCard);
router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required(),
  }),
}), deleteCard);
router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required(),
  }),
}), addLike);
router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).required(),
  }),
}), deleteLike);

module.exports = router;
