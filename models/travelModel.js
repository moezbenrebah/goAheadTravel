const mongoose = require('mongoose');
const slugify = require('slugify');

const TravelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A travel must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A travel must have a maximum of 40 characters'],
    minlength: [10, 'A travel must have a minimum of 10 characters'],
  },
  slug: String,
  secretTravel: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    required: [true, 'A travel duration is required']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A travel group size must be defined']
  },
  difficulty: {
    type: String,
    required: [true, 'A travel difficulty must be defined'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty have to be easy, medium, or difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4,
    min: [1, 'The minimum rating have to be at least 1.0'],
    max: [5, 'The maximum rating have to be equal to 5.0'],
    set: (value) => Math.round(value * 10) / 10, // Enable ratings average to round the value of ratings Exple: 4.666 -> 4.7
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A travel must have a price']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(value) {
        // this keyword only points to the current doc on New document creation
	return value < this.price;
      },
      message: '{VALUE} have to be less than the price'
    }
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'please provide a travel description']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
  type: String,
    required: [true, 'please provide a travel image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDates: [Date],
  startLocation: {
    // GeoJSON: specify geospatial data
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  locations: [
    {
      type: {
	type: String,
	default: 'Point',
	enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number
    }
  ],
  guides: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Implement index to improve the searching performance
TravelSchema.index({ price: 1, ratingsAverage: -1 });
TravelSchema.index({ slug: 1 });
TravelSchema.index({ startLocation: '2dsphere' });

TravelSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// Implement virtual populate to avoid get a hugde array of reviews within the travel document
TravelSchema.virtual('ratings', {
  ref: 'Rating',
  foreignField: 'travel',
  localField: '_id'
});

// MONGOOSE DOCUMENT MIDDLEWARE
TravelSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE
TravelSchema.pre(/^find/, function(next) {
  this.find({ secretTravel: { $ne: true }});
  next();
});

// use populate along with guides' Id to retrieve guides data that's referenced in the travel document
TravelSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
});

// log all data to console after avery find (findById, find...) queries
TravelSchema.post(/^find/, (doc, next) => {
  // console.log(doc);
  next();
});

// AGGREGATION MIDDLEWARE
// TravelSchema.pre('aggregate', function(next) {
// 	this.pipeline().unshift({ $match: { secretTravel: { $ne: true } } });
// 	next();
// })

const Travel = mongoose.model('Travel', TravelSchema);

module.exports = Travel;
