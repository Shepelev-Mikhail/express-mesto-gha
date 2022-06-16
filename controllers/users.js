const User = require('./models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.status(200).send({ data: user }))
    .catch(err => res.status(500).send({message: 'Произошла ошибка'}))
};

module.exports.findAllUser = (req, res) => {
  User.find({})
    .then(users => res.status(200).send({ data: users }))
    .catch(err => res.status(500).send({message: 'Произошла ошибка'}))
};

module.exports.findByIdUser = (req, res) => {
  User.findById(req.params.id)
    .then(user => res.status(200).send({ data: user }))
    .catch(err => res.status(500).send({message: 'Произошла ошибка'}))
};



