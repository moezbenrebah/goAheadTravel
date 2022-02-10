const ErrHandlingClass = require('../utilities/errorHandlingClass');

// handle invalid path error
const handleCastDBerror = error => {
	const message = `Wrong ${error.path}: ${error.value}`;
	return new ErrHandlingClass(message, 400);	
}

// handle duplicate field that required unique value
const handleDuplFieldDBerror = error => {
	const message = `${error.keyValue.name} is already exist`;
	return new ErrHandlingClass(message, 400);
}

// handle wrong input data error
const handleWrongInputDBerror = error => {
	const errors = Object.values(error.errors).map(item => item.message)
	const message = `Invalid input. ${errors.join('. ')}`
	return new ErrHandlingClass(message, 400);
}

// handle Invalid Signature JWT
const handleJWTSignerror = () => new ErrHandlingClass('please verify your email or password', 401);

// handle JWT expired time
const handleJWTExperror = () => new ErrHandlingClass('Your session has expired, please login', 401);


// handle DEVELOPMENT ERRORS (send to developer)
const devError = (error, req, res) => {
	// For APIs
	if (req.originalUrl.startsWith('/api')) {
		return res.status(error.statusCode).json({
			status: error.status,
			error: error,
			message: error.message,
			stack: error.stack,
		});
	}
	// For rendered website
	// 1- log error:
	console.log(error);

	// 2- generate the error message
	return res.status(error.statusCode).render('Error', {
		title: 'Aouch, someting went wrong!',
		message: error.message
	});
};


// handle PRODUCTION ERRORS (send to client)
const prodError = (error, req, res) => {
	// communicate trusted operational errors to client
	// For APIs
	if (req.originalUrl.startsWith('/api')) {
		// opertional trusted error: send error message to client
		if (error.isOperational) {
			return res.status(error.statusCode).json({
				status: error.status,
				message: error.message,
			});
		}
		// Programming or other unknown error
		// 1- log error:
		console.error(error);
		
		// 2- generate friendly error message
		return res.status(500).json({
			status: 'error',
			message: 'something went wrong!'
		});
	}
	// For rendered website
	// opertional trusted error: send error message to client
	if (error.isOperational) {
		console.log(error);
		return res.status(error.statusCode).render('Error', {
			status: 'something went wrong!',
			message: error.message,
		});
	}
	// Programming or other unknown error
	// 1- log error:
	console.error('ERROR', error);
	
	// 2- generate friendly error message
	return res.status(error.statusCode).render('Error', {
		status: 'something went wrong!',
		message: 'Please try again later!'
	});
}

// export error controller module
module.exports = (error, req, res, next) => {
	console.log(error.stack);
	error.statusCode = error.statusCode || 500;
	error.status = error.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		devError(error, req, res)
	}	else if (process.env.NODE_ENV === 'production') {
		let err = Object.create(error);
		if (err.name === 'CastError') err = handleCastDBerror(err);
		if (err.code === 11000) err = handleDuplFieldDBerror(err);
		if (err.name === 'ValidationError') err = handleWrongInputDBerror(err);
		if (err.name === 'JsonWebTokenError') err = handleJWTSignerror();
		if (err.name === 'TokenExpiredError') err = handleJWTExperror();
		prodError(err, req, res)
	}
};