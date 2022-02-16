const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const ErrHandlingClass = require('./utilities/errorHandlingClass');
const globalErrorHandler = require('./controllers/errorController');
const bookingController = require('./controllers/bookingController')
const travelRouter = require('./routes/travelRoutes');
const userRouter = require('./routes/userRoutes');
const ratingRouter = require('./routes/ratingRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewsRouter = require('./routes/viewsRoutes');

const app = express();

// trust heroku proxy
app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES

// Enable cross origin resources share
/**
In case we have our APIs in a subdomain and the front-end in another domain, example:
api.goaheadtravel.com and goaheadtravel.com, the cors implementation will be like so:
app.use(
  cors({
    origin: 'https://www.goaheadtravel.com'
  });
)
*/
app.use(cors());

/**
Enabel cors for simple and non simple-requests (put, patch, delete)
or requests that sends cookies or non-stander headers by using preflight phase
to allow non-simple requests in all routes
*/

app.options('*', cors());

// Serving static files
app.use(express.static(path.join(__dirname, './public')));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ENHANCE APPLICATION SECURITY - Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false // fix sameorigin cors issue in order to render stripe checkout session 
  })
);

// use the stripe webhook in order to create a new booking travel
// app.post(
//   '/webhook-checkout',
//   express.raw({ 'application/json' }),
//   bookingController.webhookCheckout
// );

app.route('/webhook-checkout')
  .post(express.raw({ type: "application/json" }), bookingController.webhookCheckout);

app.use(viewsRouter);

// ENHANCE APPLICATION SECURITY - Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again later!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// ENHANCE APPLICATION SECURITY - Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// ENHANCE APPLICATION SECURITY - Data sanitization against XSS
app.use(xss());

// ENHANCE APPLICATION SECURITY - Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// using commpression module to compress texts (pug, json) send it to client
app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.cookies);
  next();
});

// 3) ROUTES
app.use('/', viewsRouter);
app.use('/api/v1/travels', travelRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/ratings', ratingRouter);
app.use('/api/v1/bookings', bookingRouter);

// Handle any request that beyond the above routes
app.all('*', (req, res, next) => {
  next(new ErrHandlingClass(`Can't find ${req.originalUrl} on this server!`, 404));
});

// If there is any request reach this point it will handled by the global error controller
app.use(globalErrorHandler);

module.exports = app;