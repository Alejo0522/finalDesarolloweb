const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, reviewController.createReview);
router.get('/', authMiddleware, reviewController.getAllReviews);
router.put('/:id', authMiddleware, reviewController.updateReview);
router.delete('/:id', authMiddleware, reviewController.deleteReview);

module.exports = router;
