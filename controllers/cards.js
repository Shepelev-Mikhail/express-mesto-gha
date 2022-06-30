const Card = require('../models/card');
const { ERROR_CODE_VALID, ERROR_CODE_NOT_FOUND, ERROR_CODE_DEFAULT } = require('../error');

// создание карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_VALID).send({ message: 'Переданы некорректные данные карточки' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' });
    });
};

// найти все карточки
module.exports.findAllCard = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' }));
};

// удалить карточку
module.exports.deleteCard = (req, res) => {
  const removeCard = () => {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => res.send(card));
  };

  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
      }
      if (card.owner.toString() !== req.user._id) {
        return res.send({ message: 'Вы не являетесь владельцем карточки' });
      }
      removeCard();
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_VALID).send({ message: 'Переданы некорректные данные карточки' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' });
    });
};

// поставить лайк
module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_VALID).send({ message: 'Переданы некорректные данные карточки' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' });
    });
};

// удалить лайк
module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_VALID).send({ message: 'Переданы некорректные данные карточки' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: 'Произошла ошибка' });
    });
};
