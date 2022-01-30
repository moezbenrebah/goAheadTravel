const express = require('express');
const travelController = require('../controllers/travelController');
const authController = require('../controllers/authController');
const ratingRoutes = require('./ratingRoutes');

const router = express.Router();

// Open for everyone

// Amount routers middleware in order redirect to rating routes whenever a user hit this URL
router.use('/:travelId/ratings', ratingRoutes)

router.route('/').get(travelController.getAllTravels)
router.route('/:id').get(travelController.getTravel)
router.route('/top-3-popular').get(travelController.popularTravels, travelController.getAllTravels)
// router.route('/stat-ratings').get(travelController.TravelStat, travelController.getAllTravels)

// Geo locations routes
router
	.route('/distancesfrom/:lnglat/unit/:unit').get(authController.grantAcess, travelController.getDistances)
router
	.route('/find-travel/:distance/center/:lnglat/unit/:unit').get(authController.grantAcess, travelController.getTravelWithin)

// Restrict to admin & lead-guide
router.use(authController.grantAcess, authController.authorization('admin', 'lead-guide'))

router.route('/avg-travel-per-month/:year').get(travelController.travelPerMonth)

router.route('/').post(travelController.addtravel);

router
	.route('/:id')
	.patch(authController.grantAcess, authController.authorization('admin'), travelController.updatetravel)
	.delete(authController.grantAcess, authController.authorization('admin'), travelController.deletetravel);


module.exports = router;
