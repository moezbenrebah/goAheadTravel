const nodemailer = require('nodemailer');

const sendingEmail = async configs => {
	// Step 1: create a transporter (service to send email)
	const transport = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: 2525,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD
		}
	});

	// Step 2: define email configuration
	const emailConfigs = {
		from: 'admin <capitano_mouez85@yahoo.com>',
		to: configs.email,
		subject: configs.subject,
		text: configs.message,
	}

	// Step 3: sending the email
	await transport.sendMail(emailConfigs);
};

module.exports = sendingEmail;
