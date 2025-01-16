const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
	host: 'sandbox.smtp.mailtrap.io',
	port: 2525,
	auth: {
		user: process.env.MAILTRAP_USER,
		pass: process.env.MAILTRAP_PASS,
	},
});

// Function to send a welcome email
const sendWelcomeEmail = async (email) => {
	const mailOptions = {
		from: {
			name: 'Dev Red',
			address: 'devred123@yopmail.com',
		},
		to: email,
		subject: 'Welcome to the World',
		text: 'Welcome to the World Bruh',
		html: '<p>Welcome to the World Bruh</p>',
	};

	transport.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log('Error sending welcome email:', error);
		} else {
			console.log('Welcome email sent successfully:', info.response);
		}
	});
};

// Function to send a password change confirmation email
const sendEmailChangePassword = async (email, confirmationCode) => {
	const mailOptions = {
		from: {
			name: 'Dev Red',
			address: 'devred123@yopmail.com',
		},
		to: email,
		subject: 'Password Change Confirmation',
		text: `Your confirmation code is: ${confirmationCode}`,
		html: `<p>Your confirmation code is: <strong>${confirmationCode}</strong></p>`,
	};

	transport.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log('Error sending password change email:', error);
		} else {
			console.log('Password change email sent successfully:', info.response);
		}
	});
};

module.exports = { sendWelcomeEmail, sendEmailChangePassword };
