const express = require('express');
const router = express.Router();
const {
  getAllYields,
  getYield,
  createYield,
  updateYield,
  deleteYield,
  getCropSummary
} = require('../controllers/yieldController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAllYields)
  .post(createYield);

router.get('/summary', getCropSummary);

router.route('/:id')
  .get(getYield)
  .put(updateYield)
  .delete(deleteYield);

module.exports = router;
