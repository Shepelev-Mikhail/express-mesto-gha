const router = require('express').Router();
const User = require('./models/user');
const { createUser, findAllUser, findByIdUser } = require('./controllers/users');

router.get('/users', findAllUser);

router.get('/users/:userId', findByIdUser);

router.post('/users', createUser);

module.exports = router;