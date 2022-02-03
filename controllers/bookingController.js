require ('dotenv').config({ path: './config.env' });
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const Travel = require('../models/travelModel');
const catchAsyncHandler = require('../utilities/catchAsyncHandler');
const ErrHandlingClass = require('../utilities/errorHandlingClass');
//const factoryHandler = require('./factoryHandler');

exports.getCheckoutStripe = catchAsyncHandler( async(req, res, next) => {
	const travel = await Travel.findById(req.params.travelId);

	if (!travel) {
		return next(new ErrHandlingClass('No Travel exist with this name', 404));
	}

	// 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
		// Information about the checkout session
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}`,
    cancel_url: `${req.protocol}://${req.get('host')}/travel/${travel.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.travelId,

		// Information about the travel
    line_items: [
      {
        name: `${travel.name} Travel`,
        description: travel.summary,
        images: [`https://www.goaheadtravel.dev/img/tours/${travel.imageCover}`],
        amount: travel.price * 100, // the amount is expected to be in cent 1.00$
        currency: 'usd',
        quantity: 1
      }
    ]
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });

	//next();
})