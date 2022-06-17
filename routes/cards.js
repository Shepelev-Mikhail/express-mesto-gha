const router = require('express').Router();
const { createCard, findAllCard, deleteCard, addLike, deleteLike  } = require('../controllers/cards');

router.get('/cards', findAllCard);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', addLike);
router.delete('/cards/:cardId/likes', deleteLike);

module.exports = router;