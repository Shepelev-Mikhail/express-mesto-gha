const Card = require('../models/card');
const ValidError = require('../errors/ValidError');
const NotFoundError = require('../errors/NotFoundError');
const AccessError = require('../errors/AccessError');

// создание карточки
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidError('Переданы некорректные данные карточки'));
        return;
      }
      next(err);
    });
};

// найти все карточки
module.exports.findAllCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

// удалить карточку
module.exports.deleteCard = (req, res, next) => {
  const removeCard = () => {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => res.status(200).send(card))
      .catch(next);
  };

  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным id не найдена'));
        return;
      }
      if (card.owner.toString() !== req.user._id) {
        next(new AccessError('Вы не являетесь владельцем карточки'));
        return;
      }
      removeCard();
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidError('Переданы некорректные данные карточки'));
        return;
      }
      next(err);
    });
};

// поставить лайк
module.exports.addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным id не найдена'));
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidError('Переданы некорректные данные карточки'));
        return;
      }
      next(err);
    });
};

// удалить лайк
module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      }
      return res.status(200).send(card);
    })
    .catch(next);
};
