const express = require('express');

const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.grantAcess);

// Create a booking based on a successful stripe checkout session
router.get('/checkout-stripe/:travelId',  authController.grantAcess, bookingController.getCheckoutStripe);

router.use(authController.authorization('admin', 'lead-guide'));

router
	.route('/')
	.get(bookingController.getAllBookings)
	.post(bookingController.createBooking);

router
	.route('/:id')
	.get(bookingController.getOneBooking)
	.patch(bookingController.updateBooking)
	.delete(bookingController.deleteBooking)

module.exports = router;
