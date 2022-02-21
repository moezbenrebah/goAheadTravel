const Travel = require('../models/travelModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsyncHandler = require('../utilities/catchAsyncHandler');
const ErrHandlingClass = require('../utilities/errorHandlingClass');

// set middleware to enable the alert messages in HTML pages whenever a event occurs
exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') {
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
  }
  next();
};

//** get the the overview page
exports.getTravelOverview = catchAsyncHandler(async (req, res, next) => {
  const travels = await Travel.find();
  res.status(200).render('overview', {
    title: 'All Travels',
    travels,
  });
});

//** get travel details page
exports.getTravelDetail = catchAsyncHandler(async (req, res, next) => {
  const travel = await Travel.findOne({slug: req.params.slug}).populate({
    path: 'ratings',
    fields: 'review rating user'
  });

  if (!travel) {
    return next(new ErrHandlingClass('There is no travel with such name', 404))
  }

  res.status(200).render('travel', {
    title: `${travel.name} Travel`,
    travel
  });
});

//** get the login page
exports.accountLogin = (req, res) => {
  res.status(200).render('login', {
    title: 'log in please'
  });
};

//** get the signup page
exports.accountSignup = (req, res) => {
  res.status(200).render('signup', {
    title: 'signup please'
  });
};

//** get the user account page
exports.myAccount = (req, res) => {
  res.status(200).render('profile', {
    title: 'take a look at your account'
  });
};

//** get the forgot password page
exports.forgotPassword = (req, res) => {
  res.status(200).render('forgotPassword', {
    title: 'forgotpassword'
  });
};

//** get the reset password page
exports.resetPassword = (req, res) => {
  res.status(200).render('resetPassword', {
    title: 'reset password',
    token: req.params.token
  });
};

//** handle users' data updating
exports.updateUserData = catchAsyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('profile', {
    title: 'take a look at your account',
    user: updatedUser
  });
});

//** get all booked travels per user
exports.myBookedTravels = catchAsyncHandler( async(req, res, next) => {
  // find all booked travels based on user id
  const bookedTravels = await Booking.find({ user: req.user.id });

  if (!bookedTravels) {
    res.render('nobooking');
  }

  // find all travels that includes the above id (bookedTravels)
  const travelsIds = bookedTravels.map(item => item.travel);
  const travels = await Travel.find({ _id: { $in: travelsIds } });

  // Render the page that contains the booked travels
  res.status(200).render('overview', {
    title: 'My travels',
    travels
  });
});
