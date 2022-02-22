const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/userModel');
const catchAsyncHandler = require('../utilities/catchAsyncHandler');
const ErrHandlingClass = require('../utilities/errorHandlingClass');
const factoryHandler = require('./factoryHandler');

//** Store photos in filesystem
// The memory storage engine stores the files in memory as `Buffer` objects in order
// to enable files used by other processes in this case the sharp module
const multerStorage = multer.memoryStorage()

// Test whether the file uploaded is an image
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new ErrHandlingClass('the file uploaded is not an image', 400), false)
  }
}

//** Multer image uploader
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

//** Uploading image controller
exports.uploadPhotos = upload.single('photo');

//** Image processing controller
exports.resizeProfileImage = catchAsyncHandler( async(req, res, next) => {
  // if there is no file uploaded, jump to the next middleware
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  // resize big image to a square format of 500x500
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({quality: 90})
    .toFile(`./public/img/users/${req.file.filename}`);

  next();
});

//** Update user data function
const updatedData = (data, ...allowedData) => {
  const newData = {};
  Object.keys(data).forEach(item => {
    if (allowedData.includes(item)) newData[item] = data[item]
  });

  return newData;
}

//** Get all users from the DB
exports.getAllUsers = catchAsyncHandler(async (req, res, next) => {
  const users = await User.find();

  // Send response
  res.status(200).json({
    result: users.length,
    status: 'success',
    data: {
      users
    }
  });
});


//** Allow user to update his data
exports.updateMyData = catchAsyncHandler( async(req, res, next) => {
  // Step 1: restrict updating user password from this route
  if(req.body.password || req.body.passwordValidation) {
    return next(new ErrHandlingClass('Please use the appropriate link to update your password', 400))
  }

  // filter data allowed to be updated by user
  const allowedBodyData = updatedData(req.body, 'name', 'email', 'role');

  // Handle the case if the user didn't upload a profile image
  if (req.file) allowedBodyData.photo = req.file.filename;

  // Update user data (just allowed data)
  const updateUserData = await User.findByIdAndUpdate(req.user.id, allowedBodyData, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUserData
    }
  });
});

//** Get the current user account
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

//** Allow user to delete his account
exports.deleteUserAccount = catchAsyncHandler( async(req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

//** Get user
exports.getUser = factoryHandler.getOnce(User);

//** Add user
exports.addUser = factoryHandler.addOnce(User);

//** Update user data "findByIdAndUpdate()" for admin privileges
exports.updateUser = factoryHandler.updateOnce(User)

//** Delete user
exports.deleteUser = factoryHandler.deleteOnce(User);
