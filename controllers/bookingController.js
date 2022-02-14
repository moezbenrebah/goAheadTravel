require ('dotenv').config();
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const Travel = require('../models/travelModel');
const Booking = require('../models/bookingModel');
const catchAsyncHandler = require('../utilities/catchAsyncHandler');
const ErrHandlingClass = require('../utilities/errorHandlingClass');
const factoryHandler = require("./factoryHandler");

exports.getCheckoutStripe = catchAsyncHandler( async(req, res, next) => {
	const travel = await Travel.findById(req.params.travelId);

	if (!travel) {
		return next(new ErrHandlingClass('No Travel exist with this name', 404));
	}

	// 2) Create checkout session as request
  const session = await stripe.checkout.sessions.create({
		// Information about the checkout session
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?travel=${req.params.travelId}&user=${req.user.id}&price=${travel.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/travel/${travel.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.travelId,

		// Information about the travel
    line_items: [
      {
        name: `${travel.name} Travel`,
        description: travel.summary,
        images: [`https://www.goaheadtravel.herokuapp.com/img/travels/${travel.imageCover}`],
        amount: travel.price * 100, // the amount is expected to be in cent 1.00$
        currency: 'usd',
        quantity: 1
      }
    ]
  });

  // render the checkout session as response
  res.status(200).json({
    status: 'success',
    session
  });
});

// create booking based on successful stripe checkout session
exports.bookingBasedSuccessSession = catchAsyncHandler( async(req, res, next) => {
  const { travel, user, price } = req.query;

  if (!travel && !user && !price) return next();

  await Booking.create({ travel, user, price });
  res.redirect(req.originalUrl.split('?')[0]);
});

exports.getAllBookings = catchAsyncHandler(async (req, res, next) => {
	const bookings = await Booking.find();

	// Send response
	res.status(200).json({
		result: bookings.length,
		status: 'success',
		data: {
			bookings
		}
	});
})

exports.createBooking = factoryHandler.addOnce(Booking);
exports.getOneBooking = factoryHandler.getOnce(Booking);
exports.updateBooking = factoryHandler.updateOnce(Booking);
exports.deleteBooking = factoryHandler.deleteOnce(Booking);