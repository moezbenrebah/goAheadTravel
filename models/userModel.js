const crypto  = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
		type: String,
		required: [true, 'this field is required'],
		unique: [true, 'this name is already exist'],
	},
	email: {
		type: String,
		required: [true, 'this field is required'],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'A valid email is required!']
	},
	photo: String,
	role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
	password: {
		type: String,
		required: [true, 'A password is required'],
		minlength: [8, 'Please provide a password with 8 characters a least'],
		select: false,
	},
	passwordValidation: {
		type: String,
		required: [true, 'Please confirm your password'],
		validate: {
			// works only on CREATE & SAVE!
			validator: function(item) {
				return item === this.password
			},
			message: "Passwords are not same!"
		}
	},
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date,
	active: {
		type: Boolean,
		default: true,
		select: false
	},
});

// MONGOOSE DOCUMENT MIDDLEWARE
userSchema.pre('save', async function(next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 12);

	// delete old password
	this.passwordValidation = undefined;
	next();
});

// Run before any new document gonna be saved, in order to automate saving password
// when it's been modified successfully or when a new document is created
userSchema.pre('save', function(next) {
	if (!this.isModified('password') || this.isNew) return next();

	// Special case: sometimes saved "passwordChangedAt" in DB can be slower than issued a token, so we substract 1 second in order
	this.passwordChangedAt = Date.now() - 1000;
	next();
});

// mogoose middleware that comes before every query that begin with 'find'
userSchema.pre(/^find/, function(next) {
	// this points to the current query
	this.find({ active: { $ne: false } });
	next();
});  

// An instance method to verify password correcteness
userSchema.methods.validPassword = async function(
	passwordToCheck,
	userPassword
) {
	return await bcrypt.compare(passwordToCheck, userPassword);
};

// An instance method to verify whether the user has changed his password or not
userSchema.methods.changedPasswordCheck = function(tokenTimestamp) {
	if (this.passwordChangedAt) {
		const passwordParse = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

		return tokenTimestamp < passwordParse;
	}
	return false;
}

// An instance method to generate a random token to reset user password
userSchema.methods.genResetPassToken = function() {
	const randomToken = crypto.randomBytes(64).toString('hex');
	this.passwordResetToken = crypto.createHash('sha256').update(randomToken).digest('hex');

	console.log({ randomToken }, this.passwordResetToken)

	this.passwordResetExpires = Date.now() + 5 * 60 * 1000;

	return randomToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
