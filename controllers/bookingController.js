require ('dotenv').config();
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const Travel = require('../models/travelModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const Email = require('../utilities/nodemail');
const catchAsyncHandler = require('../utilities/catchAsyncHandler');
const factoryHandler = require("./factoryHandler");

// Create stripe checkout session payment via card bank
exports.getCheckoutStripe = catchAsyncHandler( async(req, res, next) => {
	const travel = await Travel.findById(req.params.travelId);

	// 2) Create checkout session as request
  const session = await stripe.checkout.sessions.create({
		// Information about the checkout session
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-booked-travels?alert=booking`,
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

// expand line_items in order to retrieve its data from the event (completed checkout session)
const sessionLineItems = async (event) => {
  const expandedProp = await stripe.checkout.sessions.retrieve(event.data.object.id, {
      expand: ['line_items']
  });
  const lineItemDataObj = expandedProp.line_items.data[0];
  return lineItemDataObj;
};

// Handle booking creation data
const createBookingCheckout = async (session, linkedData) => {
  const travel = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const userEmail = await User.findOne({ email: session.customer_email });
  const price = parseInt(linkedData.amount_total / 100, 10);
  const url = session.success_url.split('?')[0]
  await Booking.create({ travel, user, price });
  await new Email(userEmail, url).sendBookedTravel();
}

// Stripe webhook handler
exports.webhookCheckout = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOKS_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Create a new booking whenever a successful payment event occurs
  if (event.type === 'checkout.session.completed') {
    const linkedData = await sessionLineItems(event);
    createBookingCheckout(event.data.object, linkedData);
  }
  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
};

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