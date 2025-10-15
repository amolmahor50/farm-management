const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  deleteAccount,
  updateDeviceToken,
  removeDeviceToken
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.delete('/account', deleteAccount);
router.post('/device-token', updateDeviceToken);
router.delete('/device-token', removeDeviceToken);

module.exports = router;
