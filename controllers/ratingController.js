const Rating = require('../models/ratingModel');  
const catchAsyncHandler = require('../utilities/catchAsyncHandler');
const factoryHandler = require('./factoryHandler');

// Retrieve all ratings stored in the DB
exports.getAllRatings = catchAsyncHandler( async(req, res, next) => {
	// Allowing users to get a specific travel rating, once the travel id added to URL,
	// in other word once he hit this URL
	let filterRatings = {};
	if (req.params.travelId) filterRatings = { travel: req.params.travelId };

	const ratings = await Rating.find(filterRatings);

	res.status(200).json({
		result: ratings.length,
		status: 'success',
		data: {
			ratings
		}
	});
});

// Create a rating to a specific travel
exports.addRating = catchAsyncHandler( async(req, res, next) => {
	// Enable nested routes
	if (!req.body.travel) req.body.travel = req.params.travelId;
	if (!req.body.user) req.body.user = req.user.id;

	const newRating = await Rating.create(req.body)

	res.status(201).json({
		status: 'success',
		data: {
			rating: newRating
		}
	})
});

// Get a review
exports.getRating = factoryHandler.getOnce(Rating);

// Update a rating
exports.updateRating = factoryHandler.updateOnce(Rating);

// Delete a rating
exports.deleteRating = factoryHandler.deleteOnce(Rating);
