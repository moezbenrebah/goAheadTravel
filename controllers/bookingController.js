require ('dotenv').config();
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const Travel = require('../models/travelModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const catchAsyncHandler = require('../utilities/catchAsyncHandler');
const factoryHandler = require("./factoryHandler");

// Create stripe checkout session payment via card bank
exports.getCheckoutStripe = catchAsyncHandler( async(req, res, next) => {
	const travel = await Travel.findById(req.params.travelId);

	// 2) Create checkout session as request
  const session = await stripe.checkout.sessions.create({
		// Information about the checkout session
    payment_method_types: ['card'],
    //success_url: `${req.protocol}://${req.get('host')}/?travel=${req.params.travelId}&user=${req.user.id}&price=${travel.price}`
    success_url: `${req.protocol}://${req.get('host')}/my-booked-travels`,
    cancel_url: `${req.protocol}://${req.get('host')}/travel/${travel.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.travelId,

		// Information about the travel
    line_items: [
      {
        name: `${travel.name} Travel`,
        description: travel.summary,
        images: [`${req.protocol}://${req.get('host')}/img/travels/${travel.imageCover}`],
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

// ********************

exports.createBookingCheckout = async session => {
  const travel = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.line_items[0].amount / 100;
  await Booking.create({ travel, user, price });
}

// exports.webhookCheckout = (req, res, next) => {
//   const sig = req.headers['stripe-signature'];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOKS_SECRET
//     );
//   } catch (err) {
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'checkout.session.completed':
//       createBookingCheckout(event.data.object);
//       // Then define and call a function to handle the event checkout.session.completed
//       break;
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   res.status(200).json({ received: true });
// };

// ********************

// create booking based on successful stripe checkout session
// exports.bookingBasedSuccessSession = catchAsyncHandler( async(req, res, next) => {
//   const { travel, user, price } = req.query;

//   if (!travel && !user && !price) return next();

//   await Booking.create({ travel, user, price });
//   res.redirect(req.originalUrl.split('?')[0]);
// });

// get all booked travels
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