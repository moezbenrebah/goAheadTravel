const express = require('express');
const viewsController = require('../controllers/viewsController')
const authController = require('../controllers/authController')

const router = express.Router();


router.get('/', authController.isLoggedIn, viewsController.getTravelOverview);
router.get('/travel/:slug', authController.isLoggedIn, viewsController.getTravelDetail);
router.get('/login', authController.isLoggedIn, viewsController.accountLogin);
router.get('/signup', viewsController.accountSignup);
router.get('/me', authController.grantAcess, viewsController.myAccount);

router.post(authController.grantAcess, viewsController.updateUserData);
  

module.exports = router;