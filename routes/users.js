const router = require('express').Router();
const { createUser, findAllUser, findByIdUser, updateProfile, updateAvatar } = require('../controllers/users');

router.get('/users', findAllUser);
router.get('/users/:userId', findByIdUser);
router.post('/users', createUser);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;