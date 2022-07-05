const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const SECRET_KEY = 'practikum_secret_key';

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    // return res.status(401).send({ message: 'Необходима авторизация' });
    throw new UnauthorizedError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (err) {
    // return res.status(401).send({ message: 'Необходима авторизация' });
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
