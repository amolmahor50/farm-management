const express = require('express');
const router = express.Router();
const {
  getAllContent,
  getContent,
  createContent,
  likeContent,
  bookmarkContent
} = require('../controllers/knowledgeController');
const { protect, optionalAuth, authorize } = require('../middleware/auth');

router.get('/', optionalAuth, getAllContent);
router.get('/:id', optionalAuth, getContent);

router.use(protect);

router.post('/', authorize('admin', 'expert'), createContent);
router.post('/:id/like', likeContent);
router.post('/:id/bookmark', bookmarkContent);

module.exports = router;
