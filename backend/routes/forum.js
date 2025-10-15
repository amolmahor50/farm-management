const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
  likePost
} = require('../controllers/forumController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, getAllPosts);
router.get('/:id', optionalAuth, getPost);

router.use(protect);

router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.post('/:id/comment', addComment);
router.post('/:id/like', likePost);

module.exports = router;
