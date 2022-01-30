const mongoose = require('mongoose');
const Travel = require('./travelModel')

const RatingSchema = new mongoose.Schema({
	review: String,
	rating: Number,
	createdAt: {
		type: Date,
		default: Date.now()
	},
	travel: {
		type: mongoose.Schema.ObjectId,
		ref: 'Travel',
		required: [true, 'Please specify the travel to rate']
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: [true, 'Each rate must belong to user']
	},
}, {
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
});

// Prevent duplicate rating on the same travel and user
RatingSchema.index({ travel: 1, user: 1 }, { unique: true });

// use populate along with guides' Id to retrieve guides data that's referenced in the travel document
RatingSchema.pre(/^find/, function(next) {
	this.populate({
		path: 'user',
		select: 'name photo'
	})
	next();
});

// calculate and update ratings & ratings average that belong to the same Travel
RatingSchema.statics.calcRatingsAvg = async function(travelId) {
	const aggRatingsStats = await this.aggregate([
		{
			$match: { travel: travelId },
		},
		{
			$group: {
				_id: '$travel',
				NumRating: { $sum: 1 },
				avgRatings: { $avg: '$rating' },
			}
		}
	]);

	if (aggRatingsStats.length > 0) {
		await Travel.findByIdAndUpdate(travelId, {
			ratingsQuantity: aggRatingsStats[0].NumRating,
			ratingsAverage: aggRatingsStats[0].avgRatings
		});
	} else {
		await Travel.findByIdAndUpdate(travelId, {
			ratingsQuantity: 0,
			ratingsAverage: 4,
		});
	}
};

// Mogoose middleware that call the calcRatingsAvg Statics function each time a new rating is created
RatingSchema.post('save', function() {
	// As Statics methods are available inside the current model we use 'this.constructor' as a work around
	// in order to get the travel id because 'Rating' varibale is not yet define.
	this.constructor.calcRatingsAvg(this.travel);
});

// Mongoose middleware to recalculate the ratings quantity + average in case of update or delete rating
RatingSchema.pre(/^findOneAnd/, async function(next) {
	this.rate = await this.findOne().clone(); // clone() used to re execute the query twice since mongoose doesnt support re execute query twice
	next();
});

RatingSchema.post(/^findOneAnd/, async function() {
	await this.rate.constructor.calcRatingsAvg(this.rate.travel);
});

const Rating = mongoose.model('Rating', RatingSchema);

module.exports = Rating;
