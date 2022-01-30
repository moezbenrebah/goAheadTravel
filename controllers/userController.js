const User = require('../models/userModel');
const catchAsyncHandler = require('../utilities/catchAsyncHandler');
const ErrHandlingClass = require('../utilities/errorHandlingClass');
const factoryHandler = require('./factoryHandler');

// Update user data function
const updatedData = (data, ...allowedData) => {
	const newData = {};
	Object.keys(data).forEach(item => {
		if (allowedData.includes(item)) newData[item] = data[item]
	});
	return newData;
}

// Get all users from the DB
exports.getAllUsers = catchAsyncHandler(async (req, res, next) => {
	const users = await User.find();

	// Send response
	res.status(200).json({
		result: users.length,
		status: 'success',
		data: {
			users
		}
	});
});


// Allow user to update his data
exports.updateMyData = catchAsyncHandler( async(req, res, next) => {
	// Step 1: restrict updating user password from this route
	if(req.body.password || req.body.passwordValidation) {
		return next(new ErrHandlingClass('Please use the appropriate link to update your password', 400))
	}

	// filter data allowed to be updated by the user
	const allowedBodyData = updatedData(req.body, 'name', 'email', 'role')

	// Update user data (just allowed data)
	const updateUserData = await User.findByIdAndUpdate(req.user.id, allowedBodyData, {
		new: true,
		runValidators: true,
	})

	res.status(200).json({
		status: 'success',
		data: {
			user: updateUserData
		}
	})
});

// Get the current user account
exports.getMe = (req, res, next) => {
	req.params.id = req.user.id;
	next();
}

// Allow user to delete his account
exports.deleteUserAccount = catchAsyncHandler( async(req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { active: false });

	res.status(204).json({
		status: 'success',
		data: null
	})
})

// Get user
exports.getUser = factoryHandler.getOnce(User);

// Add user
exports.addUser = (req, res) => {
	res.status(500).json({
		status: 'error',
		message: 'Please sign up'
	})
};

// Update user data "findByIdAndUpdate()" for admin privileges
exports.updateUser = factoryHandler.updateOnce(User)

// Delete user
exports.deleteUser = factoryHandler.deleteOnce(User);
