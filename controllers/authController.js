const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsyncHandler = require('../utilities/catchAsyncHandler');
const ErrHandlingClass = require('../utilities/errorHandlingClass');
const Email = require('../utilities/nodemail');

// Generate JWT
const genToken = id => jwt.sign({ id }, process.env.SECRET, {
	expiresIn: process.env.EXPIRE_TIME_JWT
})

// Grab the JWT (within a cookie) and send it along with a response and statusCode to user ("req"  whenever the app is deployed)
const genResJWT = (user, statusCode, req, res) => {
	const token = genToken(user._id);

	const cookieEnv = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
		),
		httpOnly: true, // denied the access or the modify of the cookie by the browser
		secure: req.secure || req.headers['x-forwarded-proto'] === 'https' // send cookie only in encrypted connection "https"
	}

	res.cookie('jwt', token, cookieEnv)

	// Remove the password from the output
	user.password = undefined;

	res.status(statusCode).json({
		status: 'success',
		data: {
			user
		},
		token
	})
}

// Sign up users & send to users the welcome email
exports.signUp = catchAsyncHandler(async (req, res, next) => {
  const newUser = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordValidation: req.body.passwordValidation
	});

	const url = `${req.protocol}://${req.get('host')}/me`;
	await new Email(newUser, url).sendWelcome();

	genResJWT(newUser, 201, req, res);
});

// Sign in users
exports.signIn = catchAsyncHandler(async (req, res, next) => {
	// check if email and password exists in DB
	const { email, password } = req.body;
	if (!email || !password) {
		return next(new ErrHandlingClass('Please provide your email or password', 400));
	}

	// check if user exists and password is correct 
	const user = await User.findOne({ email }).select('+password');

	if (!user || !(await user.validPassword(password, user.password))) {
		return next(new ErrHandlingClass('wrong email or password', 401));
	}

	// if the above tests passed show success result + user token
	genResJWT(user, 200, req, res);
});

// Log out users
exports.logOut = (req, res) => {
	res.cookie('jwt', 'loggedout', {
		expires: new Date(Date.now() + 5 * 1000),
		httpOnly: true,
	});
	res.status(200).json({ status: 'success' });
  };

// protect routes (some routes like ratings restricted to authenticate users in order to access them)
exports.grantAcess = catchAsyncHandler(async (req, res, next) => {
	// get token and check if it's exist
	let token;
	if (req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1]
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt
	}

	if (!token) {
		return next(
			new ErrHandlingClass('Please log in', 401)
		);
	}

	// check whether a token is valid or not (whether the token signature is valid or not)
	const decodedToken = await promisify(jwt.verify)(token, process.env.SECRET);

	// check if user still exist (Advanced Auth SECURITY)
	// Case 1: if the user after is logged in and created a token, the user is somehow has been deleted,
	//         so the token still valid and we must handle this case.
	// EXAMPLE: if a token has been issued before the password has changed it must no longer be valid.
	const refreshUserStat = await User.findById(decodedToken.id)
	if (!refreshUserStat) {
		return next(
			new ErrHandlingClass('This user/token is no longer exist', 401)
		);
	}

	// check whether the password has changed or not (Advanced Auth SECURITY)
	// Case 2: if the user has changed his password after the token has been issued,
	//         so we need to handle this case.
	if(refreshUserStat.changedPasswordCheck(decodedToken.iat)) {
		return next(
			new ErrHandlingClass('the password is already changed', 401)
		);
	}

	// Grant the user to access the route
	req.user = refreshUserStat;
	res.locals.user = refreshUserStat;
	next();
});

// Only for rendered pages, no errors
exports.isLoggedIn = catchAsyncHandler(async (req, res, next) => {
	if (req.cookies.jwt) {
		try {
			// check whether a token is valid or not (whether the token signature is valid or not)
			const decodedToken = await promisify(jwt.verify)(
				req.cookies.jwt,
				process.env.SECRET
			)

			// check if user still exist (Advanced Auth SECURITY)
			// Case 1: if the user after is logged in and created a token, the user is somehow has been deleted,
			//         so the token still valid and we must handle this case.
			// EXAMPLE: if a token has been issued before the password has changed it must no longer be valid.
			const refreshUserStat = await User.findById(decodedToken.id)
			if (!refreshUserStat) {
				return next();
			}

			// check whether the password has changed or not (Advanced Auth SECURITY)
			// Case 2: if the user has changed his password after the token has been issued,
			//         so we need to handle this case.
			if(refreshUserStat.changedPasswordCheck(decodedToken.iat)) {
				return next();
			}

			// if all above checks passed so there is a logged user
			res.locals.user = refreshUserStat;
			return next();
		} catch (error) {
			return next();
		}
	}
	next();
});

// authorization by role
exports.authorization = (...roles) => (req, res, next) => {
	// "roles" is an array of authorize user with admin role, 
	// to enable certain access to certain routes (for now just for admin)
	if (!roles.includes(req.user.role)) {
		return next(new ErrHandlingClass('You\'re not allow to execute this action', 403))
	}

	next();
};

// Reset password
// Step 1: user send a req to forgot password route only with his email
//         which will trigger token creation and send to that email address (simple random token)
exports.forgotPassword = catchAsyncHandler(async (req, res, next) => {
	// get user based on email
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new ErrHandlingClass('No user match this email address', 404))
	}

	// generate a random token to reset the password
	const randomToken = user.genResetPassToken();
	await user.save({ validateBeforeSave: false });

	try {
		// send that token to user's email (dev/prod)
		const passwordResetURL = `${req.protocol}://${req.get('host')}/resetpassword/${randomToken}`;
		
		await new Email(user, passwordResetURL).sendPasswordReset();
	
		res.status(200).json({
			status: 'success',
			message: 'token sent via email'
		});
	} catch(error) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;

		await user.save({ validateBeforeSave: false });
		return next(
			new ErrHandlingClass('We detect an error occurs while the password reset process, please try again'),
			500
		)
	}
});

// Step 2: user send that token along with his new password and update his password
exports.resetPassword = catchAsyncHandler(async (req, res, next) => {
	// Step 1: Get user based on the token
	const validateHashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

	const user = await User.findOne(
		{ passwordResetToken: validateHashedToken,
			passwordResetExpires: { $gt: Date.now() }
		}
	);

	// Step 2: Check whether a token was expires or not
	if (!user) {
		return next(
			new ErrHandlingClass('Invalid token or token has expired, please try again'),
			400
		)
	}
	user.password = req.body.password;
	user.passwordValidation = req.body.passwordValidation;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();

	// Step 3: Update the "passwordChangedAt" date
	// Step 4: Log the user in and send a JWT
	genResJWT(user, 200, req, res);
});

// Updating logged in user password
exports.updatePassword = catchAsyncHandler( async(req, res, next) => {
	// Get the user password
	const user = await User.findById(req.user.id).select('+password');

	// Checked if the posted password is correct
	if (!(await user.validPassword(req.body.currentPassword, user.password))) {
		return next(new ErrHandlingClass('You have entered a wrong password', 401))
	}

	// If the password is correct, update the password
	user.password = req.body.password;
	user.passwordValidation = req.body.passwordValidation;

	await user.save()

	// Log user in, and send a JWT
	genResJWT(user, 200, req, res);
})
