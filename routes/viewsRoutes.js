const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();


router.get(
  '/',
  bookingController.bookingBasedSuccessSession,
	authController.isLoggedIn,
	viewsController.getTravelOverview
);

router.get(
	'/travel/:slug',
	authController.isLoggedIn,
	viewsController.getTravelDetail
);

router.get(
	'/login',
	authController.isLoggedIn,
	viewsController.accountLogin
);

router.get(
	'/forgotpassword',
	viewsController.forgotPassword
);

router.get(
	'/resetpassword/:token',
  viewsController.resetPassword
);

router.get(
	'/signup',
	viewsController.accountSignup
);

router.get(
	'/me',
	authController.grantAcess,
	viewsController.myAccount
);

router.get(
	'/my-booked-travels',
	authController.grantAcess,
	viewsController.myBookedTravels
);

router.post(
	authController.grantAcess,
	viewsController.updateUserData
);
  

module.exports = router;