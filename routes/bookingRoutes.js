const express = require('express');

const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();



router.get('/checkout-stripe/:travelId',  authController.grantAcess, bookingController.getCheckoutStripe);

module.exports = router;
