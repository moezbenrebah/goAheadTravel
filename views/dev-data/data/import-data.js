const fs = require('fs')
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Travel = require('../../models/travelModel');
const User = require('../../models/userModel');
const Rating = require('../../models/ratingModel');

dotenv.config({ path: './config.env' });

const DateBase = process.env.DATABASE.replace(
  '<PASSWORD>',
	process.env.DATABASE_PASSWORD
);

mongoose.connect(DateBase).then(() => console.log('DB Established ...'));

// Read Json file
const travels = JSON.parse(fs.readFileSync(`${__dirname}/travels.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const ratings = JSON.parse(fs.readFileSync(`${__dirname}/ratings.json`, 'utf-8'));

// Uploading data to DB
const uploadData = async () => {
	try {
		await Travel.create(travels);
		await User.create(users);
		await Rating.create(ratings);
		console.log('uploading data successfully');
		
	} catch (error) {
		console.log(error)
	}
	process.exit()
}

// Deleting data from DB
const deleteData = async () => {
	try {
		await Travel.deleteMany();
		await User.deleteMany();
		await Rating.deleteMany();
		console.log('deleting data successfully');
		
	} catch (error) {
		console.log(error)
	}
	process.exit()
}

if (process.argv[2] === '--upload') {
	uploadData()
} else if (process.argv[2] === '--delete') {
	deleteData();
}
