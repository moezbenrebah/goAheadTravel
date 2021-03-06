const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Moez Ben Rebah <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    // sending emails in production environment
    if (process.env.NODE_ENV === 'production') {
      // Using gamil to sending emails
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_FROM,
          pass: process.env.EMAIL_FROM_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    }

    // Using mailtrap to test sending emails features
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 2525,
      auth: {
	user: process.env.EMAIL_USERNAME,
	pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/emailTemplates/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html)
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome, We are glad to have you in the family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }

  async sendBookedTravel() {
    await this.send(
      'bookedTravel',
      'Your travel was booked successfully!'
    );
  }
};
