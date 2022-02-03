const multer = require('multer');
const sharp = require('sharp');

const APIClass = require('../utilities/apiClass');
const Travel = require('../models/travelModel');
const catchAsyncHandler = require('../utilities/catchAsyncHandler');
const ErrHandlingClass = require('../utilities/errorHandlingClass');
const factoryHandler = require('./factoryHandler');

// Store photos in filesystem
// The memory storage engine stores the files in memory as `Buffer` objects in order
// to enable files used by other processes in this case the sharp module
const multerStorage = multer.memoryStorage()

// Test whether the file uploaded is an image
const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true)
	}else {
		cb(new ErrHandlingClass('the file uploaded is not an image', 400), false)
	}
}

// Multer image uploader
const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter
});

// Processing multiple images for the travel update API
exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

// Resize travel images with sharp module
exports.resizeTravelImages = catchAsyncHandler( async(req, res, next) => {
	console.log(req.files)
	// Handle the case if there's no images to uploaded
	if(!req.files.imagesCover || !req.files.images) return next();

	// resize travel coverImages
	req.body.imageCover = `travel-${req.params.id}-${Date.now()}-cover.jpeg`
	await sharp(req.files.imageCover[0].buffer)
		.resize(2000, 1333)
		.toFormat('jpeg')
		.jpeg({quality: 90})
		.toFile(`./public/img/travels/${req.body.imageCover}`);

	// resize travel images
	req.body.images = [];
	
	await Promise.all(
		req.files.images.map( async(file, index) =>{
			const filename = `travel-${req.params.id}-${Date.now()}-${index + 1}.jpeg`;
			await sharp(file.buffer)
				.resize(2000, 1333)
				.toFormat('jpeg')
				.jpeg({quality: 90})
				.toFile(`./public/img/travels/${filename}`);
			
			req.body.images.push(filename);
		})
	)

	next();
})

// Middelwares
// Aliasing middleware to get the most 3 popular travels
exports.popularTravels = (req, res, next) => {
	req.query.limit = '3';
	req.query.sort = 'ratingsAverage';
	req.query.fields = 'name,price,ratingsAverage,duration,maxSizeGroup';
	next();
};

// Routes HANDLERS
// Get all travels stored in the DB
exports.getAllTravels = catchAsyncHandler(async (req, res, next) => {
	// Execute the query 
	const apisFeatures = new APIClass(Travel.find(), req.query)
	.filtering()
	.sorting()
	.fieldsLimiting()
	.pagination();

	const allTravels = await apisFeatures.query;

	// Send response
	res.status(200).json({
		result: allTravels.length,
		status: 'success',
		data: {
			allTravels
		}
	});
});

// Retrieve a specific travel from the DB
exports.getTravel = factoryHandler.getOnce(Travel, { path: 'ratings' });

// Create a travel and store it in DB
exports.addtravel = factoryHandler.addOnce(Travel);

// Modifie an existing travel
exports.updatetravel = factoryHandler.updateOnce(Travel);

// Delete a travel from the DB
exports.deletetravel = factoryHandler.deleteOnce(Travel);

// get the travels with custom data (mongoDB Aggregation framework)
exports.TravelStat = catchAsyncHandler(async (req, res, next) => {
	const stat = await Travel.aggregate([
		{
			$match: { ratingsAverage: { $gte: 4.5 } }
		},
		{
			$group: {
				_id: { $toUpper: '$difficulty' },
				numTravels: { $sum: 1 },
				totalRatings: { $sum: '$ratingsQuantity' },
				avgRating: { $avg: '$ratingsAverage' },
				avgPrice: { $avg: '$price' },
				minPrice: { $min: '$price' },
				maxPrice: { $max: '$price' }
			}
		},
		{
			$sort: { avgPrice: 1 }
		},
		/* {
			$match: {
				_id: { $ne: 'EASY' } //excluding easy difficulty
			}
		} */
	])

	res.status(200).json({
		status: 'success',
		data: {
			stat
		}
	});
});

// get the travels average/month (mongoDB Aggregation framework)
exports.travelPerMonth = catchAsyncHandler(async (req, res, next) => {
	const year = req.params.year * 1;

	const monthlyAvg = await Travel.aggregate([
		{
			$unwind: '$startDates'
		},
		{
			$match: {
				startDates: {
					$gte: new Date(`${year}-01-01`),
					$lte: new Date(`${year}-12-31`)
				}
			}
		},
		{
			$group: {
				_id: { $month: '$startDates' },
				numTravelsPerMonth: { $sum: 1},
				travels: { $push: '$name' }
			}
		},
		{
			$addFields: {
				month: '$_id'
			}
		},
		{
			$project: {
				_id: 0
			}
		},
		{
			$sort: {
				numTravelsPerMonth: -1
			}
		},
		{
			$limit: 12
		}
	])
	
	res.status(200).json({
		status: 'success',
		data: {
			monthlyAvg
		}
	});
});

// Get a travel within a certain trajectory 
exports.getTravelWithin = catchAsyncHandler(async (req, res, next) => {
	const { distance, lnglat, unit } = req.params;
	const [lat, lng] = lnglat.split(',');
	if (!lng || !lat) {
		return next(new ErrHandlingClass('latitude or longitude not provide', 400));
	}

	const radius = unit === 'km' ? distance / 6378.1 : distance / 3963.2;

	const travels = await Travel.find({
		startLocation: { $geoWithin: { $centerSphere: [ [lat, lng], radius ] } }
	});

	res.status(200).json({
		status: 'success',
		result: travels.length,
		data: travels
	})
});

// Get distance from your location
exports.getDistances = catchAsyncHandler(async (req, res, next) => {
	const { lnglat, unit } = req.params;
	const [lat, lng] = lnglat.split(',');
	if (!lng || !lat) {
		return next(new ErrHandlingClass('latitude or longitude not provide', 400));
	}

	const multiplier = unit === 'km' ? 0.001 : 0.000621371;

	// Use aggregation pipline to get distance
	const distances = await Travel.aggregate([
		{
			$geoNear: {
				near: {
					type: 'Point',
					coordinates: [lng * 1, lat * 1]
				},
				distanceField: 'distance',
				distanceMultiplier: multiplier
			}
		},
		{
			$project: {
				distance: 1,
				name: 1
			}
		}
	]);

	res.status(200).json({
		status: 'success',
		data: distances
	})
	
});
