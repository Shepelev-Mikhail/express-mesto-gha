const Card = require('../models/card')

module.exports.createCard = (req, res) => {
  // console.log(req.user._id);
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then(card => res.status(200).send({data: card}))
    .catch(err => res.status(500).send({message: 'Произошла ошибка'}))
};

module.exports.findAllCard = (req, res) => {
  Card.find({})
    .then(cards => res.status(200).send({ data: cards }))
    .catch(err => res.status(500).send({message: 'Произошла ошибка'}))
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({message: 'Произошла ошибка'}))
};