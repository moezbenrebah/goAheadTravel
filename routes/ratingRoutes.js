const express = require('express');
const ratingController = require('../controllers/ratingController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true }); // Allow rating routes to access to travel IDs

// Restrict to authenticate users
router.use(authController.grantAcess)

// ROUTES
router
	.route('/')
	.get(ratingController.getAllRatings)
	.post(authController.authorization('user'), ratingController.addRating);

router
	.route('/:id')
	.get(ratingController.getRating)
	.patch(authController.authorization('user', 'admin'), ratingController.updateRating)
	.delete(authController.authorization('user', 'admin'), ratingController.deleteRating)

module.exports = router
