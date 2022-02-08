// catch async error handler
const catchAsyncHandler = fn => (req, res, next) => {
	fn(req, res, next).catch(next)
};

module.exports = catchAsyncHandler;