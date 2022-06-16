const router = require('express').Router();
const { createCard, findAllCard, deleteCard } = require('../controllers/cards');

router.get('/cards', findAllCard);

router.post('/cards', createCard);

router.delete('/cards/:cardId', deleteCard);

module.exports = router;