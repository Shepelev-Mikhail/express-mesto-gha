const router = require('express').Router();
const {
  findAllUser,
  findByIdUser,
  updateProfile,
  updateAvatar,
  showUserInfo,
} = require('../controllers/users');

router.get('/users', findAllUser);
router.get('/users/:userId', findByIdUser);
router.get('/users/me', showUserInfo);
router.patch('/users/me', updateProfile);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
